import { Controller, Get, Query } from '@nestjs/common';
import { MetaService } from './meta.service';

@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get('callback')
  handleCallback(
    @Query('code') code?: string,
    @Query('state') state?: string,
  ) {
    return this.metaService.handleAuthorizationCallback(code, state);
  }
}


