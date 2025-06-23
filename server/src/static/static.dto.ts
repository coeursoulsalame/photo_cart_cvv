import { IsNumber, IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ServiceOptionDto {
    @IsNumber()
    @Type(() => Number)
    id: number;

    @IsString()
    name: string;
}

export class ServiceOptionSelectDto {
    @IsNumber()
    @Type(() => Number)
    value: number;

    @IsString()
    label: string;
}

export class ServiceLogDto {
    @IsNumber()
    @Type(() => Number)
    id: number;

    @IsString()
    number: string;

    @Type(() => Date)
    start_date: Date;

    @Type(() => Date)
    end_date: Date;

    @IsNumber()
    @Type(() => Number)
    option: number;
}

export class ServiceLogResponseDto {
    @IsNumber()
    @Type(() => Number)
    id: number;

    @IsString()
    number: string;

    @IsString()
    @Transform(({ value }) => {
        if (!value) return '';
        if (typeof value === 'string' && value.includes('-')) {
            const [year, month, day] = value.split('-');
            return `${day}.${month}.${year}`;
        }
        if (value instanceof Date) {
            return value.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        return value;
    })
    startDate: string;

    @IsString()
    @Transform(({ value }) => {
        if (!value) return '';
        if (typeof value === 'string' && value.includes('-')) {
            const [year, month, day] = value.split('-');
            return `${day}.${month}.${year}`;
        }
        if (value instanceof Date) {
            return value.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        return value;
    })
    endDate: string;

    @IsString()
    serviceType: string;
}

export class CreateServiceLogDto {
    @IsString()
    number: string;

    @IsDateString()
    start_date: string;

    @IsDateString()
    end_date: string;

    @IsNumber()
    @Type(() => Number)
    option: number;
}


export class Su168Dto {
    @IsNumber()
    @Type(() => Number)
    id: number;

    @IsString()
    date: string;

    @IsString()
    file_name: string;

    @IsString()
    detection: string;

    @IsString()
    value: string;

    @IsString()
    pred: string;

    @IsNumber()
    @Type(() => Number)
    confidence_score: number;

    @IsBoolean()
    @Type(() => Boolean)
    valid_ai: boolean;
}

export class Su168ResponseDto {
    @IsNumber()
    @Type(() => Number)
    total: number;

    @IsNumber()
    @Type(() => Number)
    page: number;

    @IsNumber()
    @Type(() => Number)
    limit: number;

    @IsNumber()
    @Type(() => Number)
    totalPages: number;

    data: Su168Dto[];
}

export class GetSu168QueryDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number;
}