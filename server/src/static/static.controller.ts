import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { StaticService } from './static.service';
import { ServiceOptionSelectDto, ServiceLogResponseDto, CreateServiceLogDto, GetSu168QueryDto, Su168ResponseDto } from './static.dto';

@Controller('static')
export class StaticController {
    constructor(private readonly staticService: StaticService) {}

    @Get('service-options')
    async getServiceOptions(): Promise<ServiceOptionSelectDto[]> {
        return await this.staticService.getServiceOptions();
    }

    @Get('service-logs')
    @UsePipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }))
    async getServiceLogs(): Promise<ServiceLogResponseDto[]> {
        return await this.staticService.getServiceLogs();
    }

    @Post('create-logs')
    async createServiceLog(@Body() data: CreateServiceLogDto): Promise<ServiceLogResponseDto> {
        return await this.staticService.createServiceLog(data);
    }

    @Get('su-table')
    async getSu168Data(@Query() query: GetSu168QueryDto): Promise<Su168ResponseDto> {
        return await this.staticService.getSu168Data(query);
    }
}