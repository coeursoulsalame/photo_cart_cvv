import { Controller, Post, Get, Body, ValidationPipe } from '@nestjs/common';
import { HeatmapService } from './heatmap.service';
import { HeatmapGateway } from './heatmap.gateway';
import { HeatmapDataDto } from './heatmap.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('heatmap')
export class HeatmapController {
    constructor(
        private readonly heatmapService: HeatmapService,
        private readonly heatmapGateway: HeatmapGateway,
    ) {}

    @Public()
    @Post('update')
    receiveHeatmapData(@Body(new ValidationPipe()) heatmapData: HeatmapDataDto) {
        const result = this.heatmapService.storeHeatmapData(heatmapData);
        
        this.heatmapGateway.notifyHeatmapUpdate(heatmapData);
        
        return result;
    }

    @Public()
    @Get('latest')
    getHeatmapData() {
        return this.heatmapService.getLatestHeatmapData();
    }
}
