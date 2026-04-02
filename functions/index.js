const functions = require('firebase-functions');
const axios = require('axios');

const token = process.env.PUSHOVER_TOKEN;
const user = process.env.PUSHOVER_USER;

exports.notificarPushover = functions.https.onRequest(async (req, res) => {

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { nombre, id, repo } = req.body;

  if (!nombre || !id) {
    res.status(400).json({ error: 'Faltan nombre o id' });
    return;
  }

  if (!token || !user) {
    console.error('Faltan credenciales Pushover');
    res.status(500).json({ error: 'Configuración incorrecta' });
    return;
  }

  try {
    await axios.post('https://api.pushover.net/1/messages.json', {
      token: token,
      user: user,
      title: `🚨 QR Activado - ${repo || 'Moto'}`,
      message: `Cliente: ${nombre}\nID: ${id}`,
      priority: 0,
      sound: 'pushover'
    });
    console.log(`Notificación enviada: ${nombre} (${id})`);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error al enviar a Pushover' });
  }
});