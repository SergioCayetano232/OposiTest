// Crear y comprobar los tokens JWT que identifican al usuario
const jwt = require('jsonwebtoken');

module.exports = {
  // El token guarda quien eres y va firmado con la clave secreta del servidor
  crearToken: (payload, opcionesToken = { expiresIn: '2h' }) => {
    return jwt.sign(payload, process.env.FIRMA_JWT_SERVER, opcionesToken);
  },

  // Devuelve el contenido del token, o null si es falso o ha caducado
  verificarToken: (token) => {
    try {
      return jwt.verify(token, process.env.FIRMA_JWT_SERVER);
    } catch {
      return null;
    }
  },

  // El token viaja en la cabecera como "Authorization: Bearer xxxxx"
  extraerTokenCabecera: (cabeceras) => {
    return cabeceras['authorization']?.split(' ')[1] ?? null;
  },
};
