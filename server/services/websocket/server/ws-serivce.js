class WSservice {
    constructor() {
        this.wss = null;
    }

    setWebSocketServer(wss) {
        this.wss = wss;
    }

    broadcastMessage(message) {
        if (!this.wss) {
            console.error('WebSocket сервер не инициализирован');
            return;
        }
        
        this.wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
}

module.exports = WSservice;