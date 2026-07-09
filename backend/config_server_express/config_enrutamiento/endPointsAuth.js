// Rutas de autenticacion: todas cuelgan de /api/auth
const express = require('express');

const objetoRoutingAuth = express.Router();

// Ruta de prueba mientras montamos el resto. GET /api/auth/prueba
objetoRoutingAuth.get('/prueba', (req, res) => {
  res.status(200).send({ codigo: 0, mensaje: 'las rutas de auth responden' });
});

// Aqui iran /Registro, /Verificar y /Login en los siguientes pasos

module.exports = objetoRoutingAuth;
