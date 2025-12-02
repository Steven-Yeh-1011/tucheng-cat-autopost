import { Body, Controller, Headers, Post } from '@nestjs/common';
import { LineService } from './line.service';

@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Post('webhook')
  handleWebhook(
    @Body() body: unknown,
    @Headers('x-line-signature') signature?: string,
  ) {
    // Signature will be validated when actual logic is implemented
    return this.lineService.handleWebhook({ body, signature });
  }
}


