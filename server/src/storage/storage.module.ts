import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import minioConfig from './config/minio.config';
import { MinioHandler } from './handlers/minio-handler';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [ConfigModule.forFeature(minioConfig), CommonModule],
    providers: [MinioHandler],
    exports: [MinioHandler],
})
export class StorageModule {}