const WebSocket = require('ws');

class WSserver {
    constructor(wsController) {
        this.wsController = wsController;
    }

    initialize(server) {
        const wss = new WebSocket.Server({ server });

        const serverIp = server.address().address;
        const serverPort = server.address().port;

        console.log(`WS is running at ws://${serverIp}:${serverPort}`);

        wss.on('connection', (ws, req) => {
            this.wsController.handleConnection(ws, req);
        });

        return wss;
    }
}

module.exports = WSserver;