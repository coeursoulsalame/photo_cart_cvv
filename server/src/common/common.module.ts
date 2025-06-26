import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LocationMappingService } from './services/location-mapping.service';
import { DatabaseRouterService } from './services/database-router.service';
import { WsConfigService } from './services/ws-config.service';

@Module({
    imports: [DatabaseModule],
    providers: [LocationMappingService, DatabaseRouterService, WsConfigService],
    exports: [LocationMappingService, DatabaseRouterService, WsConfigService],
})
export class CommonModule {} 