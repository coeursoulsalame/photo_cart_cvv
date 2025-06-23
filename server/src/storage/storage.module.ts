import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import minioConfig from './config/minio.config';
import { MinioHandler } from './handlers/minio-handler';

@Module({
    imports: [ConfigModule.forFeature(minioConfig)],
    providers: [MinioHandler],
    exports: [MinioHandler],
})
export class StorageModule {}