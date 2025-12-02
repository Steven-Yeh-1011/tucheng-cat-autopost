import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MetaController } from './meta.controller';
import { MetaRepository } from './meta.repository';
import { MetaService } from './meta.service';

@Module({
  imports: [PrismaModule],
  controllers: [MetaController],
  providers: [MetaService, MetaRepository],
  exports: [MetaService],
})
export class MetaModule {}

