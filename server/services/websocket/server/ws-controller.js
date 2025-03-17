class WSController {
    constructor() {
        this.pingIntervals = new Map();
    }

    handleConnection(ws, req) {
        const ip = req.socket.remoteAddress;
        const port = req.socket.remotePort;

        console.log(`New client conn: IP ${ip}, Port ${port}`);

        ws.on('message', (message) => {
            console.log(`Received: ${message}`);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            this.clearPingInterval(ws);
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
        
        this.setupPing(ws);
    }

    setupPing(ws) {
        const pingInterval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
                ws.ping();
            }   
        }, 30000);
        
        this.pingIntervals.set(ws, pingInterval);
    }

    clearPingInterval(ws) {
        if (this.pingIntervals.has(ws)) {
            clearInterval(this.pingIntervals.get(ws));
            this.pingIntervals.delete(ws);
        }
    }
}

module.exports = WSController;