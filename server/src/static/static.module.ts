import { Module } from '@nestjs/common';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';
import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../cache/redis.module';

@Module({
    imports: [DatabaseModule, RedisModule],
    controllers: [StaticController],
    providers: [StaticService],
    exports: [StaticService],
})
export class StaticModule {}