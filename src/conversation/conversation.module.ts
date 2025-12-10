import { Module } from '@nestjs/common';
import { ConversationStateMachine } from './conversation.state-machine';
import { ConversationService } from './conversation.service';
import { FlowRegistry } from './conversation.flow-registry';
import { RegisterFlow } from './flows/register.flow';
import { TicketsFlow } from './flows/tickets.flow';

@Module({
  providers: [
    ConversationService,
    ConversationStateMachine,
    FlowRegistry,
    RegisterFlow,
    TicketsFlow,
  ],
  exports: [ConversationService]
})
export class ConversationModule {}
