import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { LineService } from './line.service';

@Controller('line')
export class LineController {
  private readonly logger = new Logger(LineController.name);

  constructor(private readonly lineService: LineService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() body: any) {
    this.logger.log('Received LINE webhook event');
    this.logger.debug(JSON.stringify(body, null, 2));

    // TODO: Implement LINE webhook event handling
    // For now, just log the event

    return { status: 'ok' };
  }
}

