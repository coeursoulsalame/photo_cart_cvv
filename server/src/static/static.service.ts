import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostgresHandler } from '../database/handlers/postgres-handler';
import { RedisService } from '../cache/redis.service';
import { ServiceOptionSelectDto, ServiceLogResponseDto, CreateServiceLogDto, Su168ResponseDto, GetSu168QueryDto, Su168Dto } from './static.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class StaticService {
    constructor(
        private readonly postgresHandler: PostgresHandler,
        private readonly redisService: RedisService,
    ) {}

    async getServiceOptions(): Promise<ServiceOptionSelectDto[]> {
        const cacheKey = 'service_options';
        
        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }

            const query = `
                SELECT id, name 
                FROM service_option 
                ORDER BY name ASC
            `;
            
            const result = await this.postgresHandler.queryMain(query);
            
            const options: ServiceOptionSelectDto[] = result.rows.map(row => ({
                value: row.id,
                label: row.name,
            }));

            await this.redisService.setex(cacheKey, 3600, JSON.stringify(options));

            return options;
        } catch (error) {
            throw new HttpException(
                'Failed to fetch service options',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getServiceLogs(): Promise<ServiceLogResponseDto[]> {
        try {
            const query = `
                SELECT 
                    sl.id,
                    sl.number,
                    TO_CHAR(sl.start_date, 'YYYY-MM-DD') as start_date,
                    TO_CHAR(sl.end_date, 'YYYY-MM-DD') as end_date,
                    sl.option,
                    so.name as option_name
                FROM service_log sl
                LEFT JOIN service_option so ON sl.option = so.id
                ORDER BY sl.id DESC
            `;
            
            const result = await this.postgresHandler.queryMain(query);
            
            const plainData = result.rows.map(row => ({
                id: row.id,
                number: row.number,
                startDate: row.start_date,
                endDate: row.end_date,
                serviceType: row.option_name || '',
            }));

            return plainData.map(item => plainToClass(ServiceLogResponseDto, item));
        } catch (error) {
            throw new HttpException(
                'Failed to fetch service logs',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createServiceLog(data: CreateServiceLogDto): Promise<ServiceLogResponseDto> {
        try {
            const query = `
                INSERT INTO service_log (number, start_date, end_date, option)
                VALUES ($1, $2::timestamp, $3::timestamp, $4)
                RETURNING id, number, TO_CHAR(start_date, 'YYYY-MM-DD') as start_date, TO_CHAR(end_date, 'YYYY-MM-DD') as end_date, option
            `;
            
            const values = [data.number, data.start_date, data.end_date, data.option];
            const result = await this.postgresHandler.queryMain(query, values);
            
            if (result.rows.length === 0) {
                throw new Error('Failed to create service log');
            }
    
            const newRecord = result.rows[0];
            
            const optionQuery = 'SELECT name FROM service_option WHERE id = $1';
            const optionResult = await this.postgresHandler.queryMain(optionQuery, [newRecord.option]);
            
            return {
                id: newRecord.id,
                number: newRecord.number,
                startDate: newRecord.start_date,
                endDate: newRecord.end_date,
                serviceType: optionResult.rows[0]?.name || '',
            };
        } catch (error) {
            throw new HttpException(
                'Failed to create service log',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getSu168Data(queryDto: GetSu168QueryDto): Promise<Su168ResponseDto> {
        try {
            const page = parseInt(String(queryDto.page));
            const limit = parseInt(String(queryDto.limit));
            const offset = (page - 1) * limit;

            const countQuery = 'SELECT COUNT(*) as total FROM su168';
            const countResult = await this.postgresHandler.queryMain(countQuery);
            const total = parseInt(countResult.rows[0].total);

            const dataQuery = `
                SELECT 
                    id,
                    TO_CHAR(date AT TIME ZONE 'UTC' AT TIME ZONE '+07:00', 'DD.MM.YYYY HH24:MI:SS') as date,
                    file_name,
                    detection,
                    value,
                    pred,
                    confidence_score,
                    valid_ai
                FROM su168 
                ORDER BY id DESC 
                LIMIT $1 OFFSET $2
            `;
            
            const dataResult = await this.postgresHandler.queryMain(dataQuery, [limit, offset]);
            
            const plainData = dataResult.rows.map(row => ({
                id: row.id,
                date: row.date,
                file_name: row.file_name,
                detection: row.detection,
                value: row.value,
                pred: row.pred,
                confidence_score: row.confidence_score,
                valid_ai: row.valid_ai,
            }));

            const transformedData = plainData.map(item => plainToClass(Su168Dto, item));
            const totalPages = Math.ceil(total / limit);

            return {
                total,
                page,
                limit,
                totalPages,
                data: transformedData,
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch su168 data',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}