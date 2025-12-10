import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [ConversationModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
