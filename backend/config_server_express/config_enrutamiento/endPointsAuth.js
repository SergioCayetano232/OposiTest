// Rutas de autenticacion: todas cuelgan de /api/auth
const express = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../../modelos/Usuario.js');
const otpService = require('../servicios/otpService.js');
const mailjetService = require('../servicios/mailjetService.js');
const jwtService = require('../servicios/jwtService.js');

const objetoRoutingAuth = express.Router();

// Al menos 8 caracteres, con una letra y un numero
const REGEX_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// Hash de mentira contra el que comparar cuando el email no existe.
// Asi el login tarda lo mismo exista o no, y nadie averigua quien tiene cuenta.
const HASH_SEÑUELO = bcrypt.hashSync('contraseña que nadie va a usar', 10);

// POST /api/auth/Registro -> crea el usuario y le genera un codigo de verificacion
objetoRoutingAuth.post('/Registro', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ codigo: 1, mensaje: 'faltan el email o la contraseña' });
    }

    if (!REGEX_PASSWORD.test(password)) {
      return res.status(400).send({
        codigo: 1,
        mensaje: 'la contraseña debe tener al menos 8 caracteres, con una letra y un numero',
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const usuarioExistente = await Usuario.findOne({ email: emailNormalizado });
    if (usuarioExistente) {
      return res.status(409).send({ codigo: 2, mensaje: 'ya hay una cuenta con ese email' });
    }

    const codigo = otpService.generarCodigo();

    const usuarioNuevo = await Usuario.create({
      email: emailNormalizado,
      password: bcrypt.hashSync(password, 10),
      codigoOtp: otpService.hashearCodigo(codigo),
      codigoOtpExpira: otpService.calcularCaducidad(),
    });

    try {
      await mailjetService.enviarCodigoBienvenida(emailNormalizado, codigo, otpService.MINUTOS_VALIDEZ);
    } catch (errorEmail) {
      // Sin email no puede verificarse, asi que deshacemos el registro y que lo reintente
      await Usuario.deleteOne({ _id: usuarioNuevo._id });
      console.log(`Error enviando el email: ${errorEmail.message}`);
      return res.status(502).send({
        codigo: 3,
        mensaje: 'no hemos podido enviarte el email, intentalo de nuevo en un momento',
      });
    }

    res.status(201).send({
      codigo: 0,
      mensaje: `te hemos enviado un codigo a ${emailNormalizado}, caduca en ${otpService.MINUTOS_VALIDEZ} minutos`,
    });
  } catch (error) {
    console.log(`Error en el registro: ${error.message}`);
    res.status(500).send({ codigo: 9, mensaje: 'error al registrar el usuario' });
  }
});

// POST /api/auth/Verificar -> comprueba el codigo del email y da acceso
objetoRoutingAuth.post('/Verificar', async (req, res) => {
  try {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
      return res.status(400).send({ codigo: 1, mensaje: 'faltan el email o el codigo' });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const usuario = await Usuario.findOne({ email: emailNormalizado });

    // Mismo mensaje si el email no existe o si el codigo falla,
    // para que nadie pueda averiguar quien esta registrado
    const codigoCorrecto = usuario && otpService.comprobarCodigo(codigo, usuario.codigoOtp);
    if (!codigoCorrecto) {
      return res.status(401).send({ codigo: 4, mensaje: 'el codigo no es correcto' });
    }

    if (usuario.verificado) {
      return res.status(409).send({ codigo: 5, mensaje: 'esta cuenta ya estaba verificada' });
    }

    if (usuario.codigoOtpExpira < new Date()) {
      return res.status(410).send({ codigo: 6, mensaje: 'el codigo ha caducado, pide uno nuevo' });
    }

    // Cuenta activada y codigo borrado, que ya no sirve de nada
    usuario.verificado = true;
    usuario.codigoOtp = null;
    usuario.codigoOtpExpira = null;
    await usuario.save();

    const token = jwtService.crearToken({ idUsuario: usuario._id, email: usuario.email });

    res.status(200).send({
      codigo: 0,
      mensaje: 'cuenta verificada, ya puedes entrar',
      token,
      usuario: { email: usuario.email },
    });
  } catch (error) {
    console.log(`Error al verificar el codigo: ${error.message}`);
    res.status(500).send({ codigo: 9, mensaje: 'error al verificar el codigo' });
  }
});

// POST /api/auth/Login -> entra un usuario que ya verifico su cuenta
objetoRoutingAuth.post('/Login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ codigo: 1, mensaje: 'faltan el email o la contraseña' });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const usuario = await Usuario.findOne({ email: emailNormalizado });

    // Si el email no existe comparamos igual contra un hash falso, para
    // que la respuesta tarde lo mismo y nadie deduzca quien esta registrado
    const hashAComparar = usuario ? usuario.password : HASH_SEÑUELO;
    const passwordCorrecta = bcrypt.compareSync(password, hashAComparar);

    if (!usuario || !passwordCorrecta) {
      return res.status(401).send({ codigo: 7, mensaje: 'email o contraseña incorrectos' });
    }

    if (!usuario.verificado) {
      return res.status(403).send({
        codigo: 8,
        mensaje: 'tu cuenta no esta verificada, revisa el codigo que te enviamos por email',
      });
    }

    const token = jwtService.crearToken({ idUsuario: usuario._id, email: usuario.email });

    res.status(200).send({
      codigo: 0,
      mensaje: 'has entrado correctamente',
      token,
      usuario: { email: usuario.email },
    });
  } catch (error) {
    console.log(`Error en el login: ${error.message}`);
    res.status(500).send({ codigo: 9, mensaje: 'error al iniciar sesion' });
  }
});

module.exports = objetoRoutingAuth;
