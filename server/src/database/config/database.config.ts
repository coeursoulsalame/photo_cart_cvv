import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
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