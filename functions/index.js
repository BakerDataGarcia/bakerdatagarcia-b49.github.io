const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const axios = require('axios');

const token = process.env.PUSHOVER_TOKEN;
const user = process.env.PUSHOVER_USER;

exports.notificarPushover = onDocumentCreated('perfiles/{perfilId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const data = snapshot.data();
  const nombre = data.nombre || 'Sin nombre';
  const id = data.id || event.params.perfilId;

  if (!token || !user) {
    console.error('❌ Faltan credenciales de Pushover en .env');
    return;
  }

  await axios.post('https://api.pushover.net/1/messages.json', {
    token, user,
    title: '🚨 QR Activado',
    message: `Cliente: ${nombre}\nID: ${id}`,
    priority: 0,
    sound: 'pushover'
  });

  console.log(`✅ Notificación enviada para ${nombre} (${id})`);
});