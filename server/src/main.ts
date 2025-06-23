import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';

async function start() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.use(cookieParser());
    app.enableCors();
    app.setGlobalPrefix('api');
    app.use(express.static(join(__dirname, '..', '..', 'client', 'public')));
    
    app.use((req, res, next) => {
        if (req.originalUrl.startsWith('/api')) {
            next();
            return;
        }
        res.sendFile(join(__dirname, '..', '..', 'client', 'public', 'index.html'));
    });
    const port = configService.get<number>('NEST_PORT', 3000);
    await app.listen(port);
    console.log(`Application is running on port ${port}`);
}
start();