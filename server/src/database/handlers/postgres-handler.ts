import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class PostgresHandler {
    private mainPool: Pool;

    constructor(private configService: ConfigService) {
        this.mainPool = new Pool({
            host: this.configService.get('database.host'),
            port: this.configService.get('database.port'),
            user: this.configService.get('database.user'),
            password: this.configService.get('database.password'),
            database: this.configService.get('database.database'),
            ssl: this.configService.get('database.ssl'),
        });
    }

    async queryMain(sql: string, values?: any[]): Promise<QueryResult> {
        return await this.mainPool.query(sql, values);
    }
    
    async getClient() {
        return await this.mainPool.connect();
    }
} 