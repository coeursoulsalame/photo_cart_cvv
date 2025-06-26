import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GalleryModule } from './gallery/gallery.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './database/config/database.config';
import { StorageModule } from './storage/storage.module';
import { StaticModule } from './static/static.module';
import { CommonModule } from './common/common.module';
import { RedisModule } from './cache/redis.module';
import { HeatmapModule } from './heatmap/heatmap.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig],
        }),
        RedisModule,
        DatabaseModule,
        AuthModule,
        GalleryModule,
        StorageModule,
        StaticModule,
        CommonModule,
        HeatmapModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}