import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';
import { GalleryModule } from './gallery/gallery.module';
import { RedisModule } from './cache/redis.module';
import { StaticModule } from './static/static.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        RedisModule,
        DatabaseModule,
        StorageModule,
        GalleryModule,
        StaticModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}