const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const configureRoutes = require('./routes');
const { setupWebSocketWithServices } = require('./services/websocket/serviceInitializer');

const app = express();
const PORT = process.env.EXPRESS_PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
configureRoutes(app);

app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});

const server = app.listen(PORT, () => {
	console.log(`EXPRESS_PORT from .env: ${PORT}`);
});

setupWebSocketWithServices(server);