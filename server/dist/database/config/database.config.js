"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    if (!host || !user || !database) {
        throw new Error('Database configuration is incomplete. Check your environment variables.');
    }
    return {
        host,
        port: parseInt(port || '5432', 10),
        user,
        password: password,
        database,
        ssl: false
    };
});
//# sourceMappingURL=database.config.js.map