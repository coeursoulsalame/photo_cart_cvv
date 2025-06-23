import { ConfigService } from '@nestjs/config';
import { QueryResult } from 'pg';
export declare class PostgresHandler {
    private configService;
    private mainPool;
    constructor(configService: ConfigService);
    queryMain(sql: string, values?: any[]): Promise<QueryResult>;
    getClient(): Promise<any>;
}
