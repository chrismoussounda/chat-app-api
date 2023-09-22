import { Controller, Get, Query } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { GetToken } from './dto/get-token';

@Controller('livekit')
export class LivekitController {
  constructor(private readonly livekitService: LivekitService) {}

  @Get()
  getToken(@Query() query: GetToken) {
    return this.livekitService.createToken(query);
  }
}
