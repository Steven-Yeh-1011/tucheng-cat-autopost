import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LineController } from './line.controller';
import { LineRepository } from './line.repository';
import { LineService } from './line.service';

@Module({
  imports: [PrismaModule],
  controllers: [LineController],
  providers: [LineService, LineRepository],
  exports: [LineService],
})
export class LineModule {}

