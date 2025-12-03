import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LineController } from './line.controller';
import { LineRepository } from './line.repository';
import { LineService } from './line.service';
import { RichMenuConfigController } from './rich-menu-config.controller';
import { RichMenuController } from './rich-menu.controller';
import { RichMenuDeployController } from './rich-menu-deploy.controller';
import { RichMenuService } from './rich-menu.service';

@Module({
  imports: [PrismaModule],
  controllers: [LineController, RichMenuController, RichMenuConfigController, RichMenuDeployController],
  providers: [LineService, LineRepository, RichMenuService],
  exports: [LineService, RichMenuService],
})
export class LineModule {}

