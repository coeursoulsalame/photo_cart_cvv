const db = require('../db');

let notifyNewPhotoCallback = null;
let notifyPhotoDeletedCallback = null;

async function setupDbNotifications() {
    const client = await db.getClient();
    try {
        await client.query('LISTEN new_photo');
        await client.query('LISTEN photo_deleted');

        client.on('notification', (msg) => {
            console.log(`Получено уведомление: ${msg.channel}`, msg.payload);
            if (msg.channel === 'new_photo' && notifyNewPhotoCallback) {
                notifyNewPhotoCallback(msg.payload);
            } else if (msg.channel === 'photo_deleted' && notifyPhotoDeletedCallback) {
                notifyPhotoDeletedCallback(msg.payload);
            }
        });

        console.log('Подписка на уведомления установлена');
    } catch (err) {
        console.error('Ошибка настройки уведомлений:', err);
        client.release();
    }
}

module.exports = {
    setupDbNotifications,
    setNotifyNewPhotoCallback: (callback) => { notifyNewPhotoCallback = callback; },
    setNotifyPhotoDeletedCallback: (callback) => { notifyPhotoDeletedCallback = callback; }
};