import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

class SensorDto {
    @IsString()
    id: string;

    @IsNumber()
    x: number;

    @IsNumber()
    y: number;

    @IsNumber()
    value: number;

    @IsNumber()
    timestamp: number;
}

class GridInfoDto {
    @IsString()
    method: string;

    @IsNumber()
    power: number;

    @IsNumber()
    stepSize: number;

    @IsNumber()
    totalPoints: number;

    @IsString()
    dimensions: string;

    @IsString()
    timestamp: string;
}

export class HeatmapDataDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SensorDto)
    sensors: SensorDto[];

    @IsArray()
    heatmapData: [number, number, number][];

    @IsArray()
    @IsString({ each: true })
    xLabels: string[];

    @IsArray()
    @IsString({ each: true })
    yLabels: string[];

    @IsObject()
    @ValidateNested()
    @Type(() => GridInfoDto)
    gridInfo: GridInfoDto;
}
