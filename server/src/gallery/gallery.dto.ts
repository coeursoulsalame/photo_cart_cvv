import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsNotEmpty, IsDateString, IsBoolean } from 'class-validator';

export class GetPhotosQueryDto {
    @IsOptional()
    @IsNumber()
    page: number;

    @IsOptional()
    @IsNumber()
    limit: number;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @Transform(({ value }) => {
        console.log('DTO Transform - value:', value, 'type:', typeof value);
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return undefined;
    })
    @IsBoolean()
    showUnrecognizedOnly?: boolean;
}

export class UpdateValueDto {
    @IsNumber()
    id: number;

    @IsString()
    value: string;
}

export class DeletePhotoDto {
    @IsNumber()
    id: number;

    @IsString()
    @IsNotEmpty()
    fileName: string;
}

export interface PhotoResponse {
    id: number;
    fileName: string;
    fullSrc: string;
    thumbnail: string;
    date: string;
    detection: string;
    value: string;
    pred: string;
    confidenceScore: string;
    validAi: boolean;
}

export interface GetPhotosResponse {
    photos: PhotoResponse[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
}

export interface PhotoUpdateData {
    operation: 'UPDATE';
    id: number;
    newData: {
        id: number;
        date: string;
        file_name: string;
        detection: string;
        value: string;
        pred: string;
        confidence_score: string;
        valid_ai: boolean;
    };
    oldData: {
        id: number;
        date: string;
        file_name: string;
        detection: string;
        value: string;
        pred: string;
        confidence_score: string;
        valid_ai: boolean;
    };
    timestamp: Date;
}

export class GetPhotoQueryDto {
    @IsString()
    @IsNotEmpty()
    filename: string;
}
