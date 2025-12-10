import { Injectable, Logger } from '@nestjs/common';
import { MessageAdapter } from '../shared/adapters/message-adapter';
import { ConversationService } from '../conversation/conversation.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly conversationService: ConversationService) {}

  handleIncoming(payload: any) {
    const msg = MessageAdapter.normalize(payload);

    if (!msg) {
      this.logger.warn('⚠️ Webhook sin mensajes entrantes');
      return;
    }

    this.logger.log('📩 Mensaje normalizado:');
    // this.logger.log(msg);

    return this.conversationService.handleMessage(msg);
  }
}
