// Todo lo relacionado con el codigo de 6 digitos que se manda por email
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Cuanto dura un codigo antes de caducar
const MINUTOS_VALIDEZ = 10;

module.exports = {
  // Genera un codigo de 6 digitos, del 000000 al 999999
  generarCodigo: () => {
    return crypto.randomInt(0, 1000000).toString().padStart(6, '0');
  },

  // El codigo se guarda hasheado, igual que las contraseñas
  hashearCodigo: (codigo) => {
    return bcrypt.hashSync(codigo, 10);
  },

  // Compara el codigo que escribe el usuario con el hash guardado
  comprobarCodigo: (codigo, hashGuardado) => {
    if (!codigo || !hashGuardado) return false;
    return bcrypt.compareSync(codigo, hashGuardado);
  },

  // Momento en el que el codigo deja de valer
  calcularCaducidad: () => {
    return new Date(Date.now() + MINUTOS_VALIDEZ * 60 * 1000);
  },

  MINUTOS_VALIDEZ,
};
