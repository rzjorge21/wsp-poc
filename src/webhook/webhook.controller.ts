import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  HttpException,
  HttpStatus,
  OnModuleInit,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller()
export class WebhookController implements OnModuleInit {
  private readonly verifyToken = process.env.VERIFY_TOKEN;

  constructor(private readonly webhookService: WebhookService) {}

  onModuleInit() {
    if (!this.verifyToken) {
      console.error('❌ ERROR: VERIFY_TOKEN no está configurado');
      throw new Error('VERIFY_TOKEN no está configurado');
    }

    console.log('✅ VERIFY_TOKEN configurado correctamente');
  }

  @Get()
  validateWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') token: string,
  ) {
    console.log('Ejecutando GET');
    console.log('mode', mode);
    console.log('challenge', challenge);
    console.log('token', token);
    if (mode === 'subscribe' && token === this.verifyToken) {
      return challenge;
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Post()
  handleWebhook(@Body() body: any) {
    this.webhookService.handleIncoming(body);

    // console.log('Ejecutando POST');
    // console.log('body', body);
    // const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    // console.log(`\n\nWebhook received ${timestamp}\n`);
    // console.log(JSON.stringify(body, null, 2));

    return { status: 'ok' };
  }
}
