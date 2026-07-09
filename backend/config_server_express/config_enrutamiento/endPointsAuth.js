// Rutas de autenticacion: todas cuelgan de /api/auth
const express = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../../modelos/Usuario.js');
const otpService = require('../servicios/otpService.js');

const objetoRoutingAuth = express.Router();

// Al menos 8 caracteres, con una letra y un numero
const REGEX_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

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

    await Usuario.create({
      email: emailNormalizado,
      password: bcrypt.hashSync(password, 10),
      codigoOtp: otpService.hashearCodigo(codigo),
      codigoOtpExpira: otpService.calcularCaducidad(),
    });

    // Hasta que montemos Mailjet, el codigo se ve por consola
    console.log(`Codigo de verificacion para ${emailNormalizado}: ${codigo}`);

    res.status(201).send({
      codigo: 0,
      mensaje: `te hemos enviado un codigo a ${emailNormalizado}, caduca en ${otpService.MINUTOS_VALIDEZ} minutos`,
    });
  } catch (error) {
    console.log(`Error en el registro: ${error.message}`);
    res.status(500).send({ codigo: 9, mensaje: 'error al registrar el usuario' });
  }
});

// Aqui iran /Verificar y /Login en los siguientes pasos

module.exports = objetoRoutingAuth;
