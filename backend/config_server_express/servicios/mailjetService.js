// Envio de emails a traves de la API de Mailjet
const URL_MAILJET = 'https://api.mailjet.com/v3.1/send';

// Mailjet autentica con las dos claves juntas en base64, al estilo Basic Auth
const cabeceraAutorizacion = () => {
  const claves = `${process.env.MAILJET_PUBLIC_APIKEY}:${process.env.MAILJET_SECRET_APIKEY}`;
  return `Basic ${Buffer.from(claves).toString('base64')}`;
};

// El correo de bienvenida, con el codigo bien grande para que se lea de un vistazo
const plantillaBienvenida = (codigo, minutos) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #333;">
    <h1 style="color: #2c5f8d;">Bienvenido a OposiTest</h1>
    <p>Gracias por registrarte. Ya casi estas dentro.</p>
    <p>Este es tu codigo de verificacion:</p>
    <p style="font-size: 34px; font-weight: bold; letter-spacing: 8px; text-align: center;
              background: #f2f5f8; padding: 18px; border-radius: 8px;">
      ${codigo}
    </p>
    <p>Escribelo en la app para activar tu cuenta. Caduca en ${minutos} minutos.</p>
    <p style="color: #888; font-size: 13px;">Si no te has registrado, ignora este correo.</p>
  </div>
`;

module.exports = {
  // Manda al usuario recien registrado su codigo de verificacion
  enviarCodigoBienvenida: async (email, codigo, minutos) => {
    const respuesta = await fetch(URL_MAILJET, {
      method: 'POST',
      headers: {
        Authorization: cabeceraAutorizacion(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_EMAIL_REMITENTE,
              Name: process.env.MAILJET_NOMBRE_REMITENTE,
            },
            To: [{ Email: email }],
            Subject: `Tu codigo de OposiTest: ${codigo}`,
            HTMLPart: plantillaBienvenida(codigo, minutos),
            TextPart: `Bienvenido a OposiTest. Tu codigo de verificacion es ${codigo}. Caduca en ${minutos} minutos.`,
          },
        ],
      }),
    });

    const cuerpo = await respuesta.json();

    // Mailjet responde 200 aunque falle, hay que mirar el Status de cada mensaje
    if (cuerpo.Messages?.[0]?.Status !== 'success') {
      throw new Error(`Mailjet no pudo enviar el email: ${JSON.stringify(cuerpo)}`);
    }
  },
};
