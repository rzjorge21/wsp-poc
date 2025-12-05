import { Injectable, Logger } from '@nestjs/common';
import { MessageAdapter } from '../shared/adapters/message-adapter';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor() {}

  handleIncoming(payload: any) {
    const msg = MessageAdapter.normalize(payload);

    if (!msg) {
      this.logger.warn('⚠️ Webhook sin mensajes entrantes');
      return;
    }

    this.logger.log('📩 Mensaje normalizado:');
    this.logger.log(msg);
  }
}
