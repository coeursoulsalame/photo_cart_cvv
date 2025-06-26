import { Injectable } from '@nestjs/common';
import { HeatmapDataDto } from './heatmap.dto';

@Injectable()
export class HeatmapService {
    private latestHeatmapData: HeatmapDataDto | null = null;

    storeHeatmapData(data: HeatmapDataDto) {
        this.latestHeatmapData = data;
        return {
            success: true,
            message: 'Heatmap data received successfully.',
        };
    }

    getLatestHeatmapData() {
        if (this.latestHeatmapData) {
            return {
                success: true,
                data: this.latestHeatmapData,
            };
        } else {
            return {
                success: false,
                message: 'No heatmap data available yet.',
                data: null,
            };
        }
    }

    getLatestHeatmapDataSync() {
        return this.getLatestHeatmapData();
    }
}