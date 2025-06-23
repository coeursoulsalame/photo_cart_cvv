import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { PostgresHandler } from './handlers/postgres-handler';

@Global()
@Module({
    imports: [
        ConfigModule.forFeature(databaseConfig),
    ],
    providers: [
        PostgresHandler,
    ],
    exports: [
        PostgresHandler,
    ],
})
export class DatabaseModule {} 