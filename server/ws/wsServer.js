const WebSocket = require('ws');
const notifyClientsAboutNewPhotos = require('./photo-updater');

const setupWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server });

    const serverIp = server.address().address;
    const serverPort = server.address().port;

    console.log(`WS is running at ws://${serverIp}:${serverPort}`);

    wss.on('connection', (ws, req) => {
        const ip = req.socket.remoteAddress;
        const port = req.socket.remotePort;

        console.log(`New client conn: IP ${ip}, Port ${port}`);

        ws.on('message', (message) => {
            console.log(`Received: ${message}`);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
        
        const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.ping(); 
                // console.log('Ping sent to client');
            }
        }, 30000);

        ws.on('close', () => {
            clearInterval(pingInterval);
        });
    });

    notifyClientsAboutNewPhotos(wss);

    return wss;
};

module.exports = setupWebSocketServer;
