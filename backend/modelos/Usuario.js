// Modelo de usuario: define que campos tiene y como se guardan en Mongo
const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'el email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'el formato del email no es valido'],
  },

  // Guardada siempre hasheada con bcrypt, nunca en texto plano
  password: {
    type: String,
    required: [true, 'la contraseña es obligatoria'],
  },

  // Hasta que no meta el codigo del email, no puede entrar
  verificado: {
    type: Boolean,
    default: false,
  },

  // El codigo OTP tambien va hasheado, por si alguien viera la base de datos
  codigoOtp: {
    type: String,
    default: null,
  },

  // Pasada esta fecha el codigo ya no vale
  codigoOtpExpira: {
    type: Date,
    default: null,
  },

  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

// El tercer parametro fuerza el nombre de la coleccion, si no Mongo la llamaria "usuarios"
module.exports = mongoose.model('Usuario', esquemaUsuario, 'usuarios');
