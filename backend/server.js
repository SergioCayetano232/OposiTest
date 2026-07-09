// Punto de entrada del servidor: lo arranca y lo pone a escuchar
require('dotenv').config();

const express = require('express');
const configPipeline = require('./config_server_express/config_pipeline.js');
const conectarMongo = require('./config_server_express/config_mongodb.js');

const serverExpress = express();
configPipeline(serverExpress);

// En Render el puerto lo decide ellos, por eso no lo fijamos a pelo
const PUERTO = process.env.PORT || 3000;

// Primero la base de datos, y solo si conecta abrimos el servidor
conectarMongo().then(() => {
  serverExpress.listen(PUERTO, (error) => {
    if (error) {
      console.log(`Error al iniciar el servidor: ${error}`);
    } else {
      console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
    }
  });
});
