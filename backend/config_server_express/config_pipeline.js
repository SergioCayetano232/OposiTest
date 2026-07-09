// Monta los middlewares por los que pasa toda peticion antes de llegar a su ruta
const express = require('express');
const cors = require('cors');

const objetoRoutingAuth = require('./config_enrutamiento/endPointsAuth.js');

module.exports = (serverExpress) => {
  // Deja leer el cuerpo de las peticiones POST en formato JSON (queda en req.body)
  serverExpress.use(express.json());

  // Solo el frontend de Angular puede llamar a esta API
  serverExpress.use(
    cors({
      origin: process.env.URL_FRONTEND || 'http://localhost:4200',
    })
  );

  // Ruta suelta para comprobar de un vistazo que el servidor esta vivo
  serverExpress.get('/ping', (req, res) => {
    res.status(200).send({ codigo: 0, mensaje: 'servidor OposiTest funcionando' });
  });

  // Todo lo del login cuelga de /api/auth
  serverExpress.use('/api/auth', objetoRoutingAuth);
};
