import { Module } from '@nestjs/common';
import { LineController } from './line.controller';
import { LineService } from './line.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [LineController],
  providers: [LineService],
  exports: [LineService],
})
export class LineModule {}

