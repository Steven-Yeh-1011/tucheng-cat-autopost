import { Module } from '@nestjs/common';
import { MetaService } from './meta.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MetaService],
  exports: [MetaService],
})
export class MetaModule {}

