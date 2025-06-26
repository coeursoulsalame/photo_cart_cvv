import { Module } from '@nestjs/common';
import { HeatmapController } from './heatmap.controller';
import { HeatmapService } from './heatmap.service';
import { HeatmapGateway } from './heatmap.gateway';

@Module({
    controllers: [HeatmapController],
    providers: [HeatmapService, HeatmapGateway],
    exports: [HeatmapService, HeatmapGateway],
})
export class HeatmapModule {}
