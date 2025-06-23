"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const cookieParser = require("cookie-parser");
const express = require("express");
const path_1 = require("path");
async function start() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use(cookieParser());
    app.enableCors();
    app.setGlobalPrefix('api');
    app.use(express.static((0, path_1.join)(__dirname, '..', '..', 'client', 'public')));
    app.use((req, res, next) => {
        if (req.originalUrl.startsWith('/api')) {
            next();
            return;
        }
        res.sendFile((0, path_1.join)(__dirname, '..', '..', 'client', 'public', 'index.html'));
    });
    const port = configService.get('NEST_PORT', 3000);
    await app.listen(port);
    console.log(`Application is running on port ${port}`);
}
start();
//# sourceMappingURL=main.js.map