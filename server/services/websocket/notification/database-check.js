class DatabaseCheck {
    constructor(db) {
        this.db = db;
        this.listeners = new Map();
    }

    async subscribe(channel, callback) {
        if (!this.listeners.has(channel)) {
            this.listeners.set(channel, []);
        }
        this.listeners.get(channel).push(callback);
    }

    async setupNotifications() {
        const client = await this.db.getClient();
        try {
            await client.query('LISTEN new_photo');
            await client.query('LISTEN photo_deleted');

            client.on('notification', (msg) => {
                console.log(`Получено уведомление: ${msg.channel}`, msg.payload);

                if (this.listeners.has(msg.channel)) {
                    this.listeners.get(msg.channel).forEach(callback => {
                        callback(msg.payload);
                    });
                }
            });

            console.log('Подписка на уведомления установлена');
        } catch (err) {
            console.error('Ошибка настройки уведомлений:', err);
            client.release();
        }
    }
}

module.exports = DatabaseCheck;