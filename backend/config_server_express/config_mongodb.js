// Abre la conexion con MongoDB Atlas una sola vez, al arrancar el servidor
const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGODB);
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.log(`No se pudo conectar a MongoDB: ${error.message}`);
    // Sin base de datos la API no sirve de nada, asi que cortamos aqui
    process.exit(1);
  }
};
