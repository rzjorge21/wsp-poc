import { Injectable } from '@nestjs/common';
import { RegisterFlow } from './flows/register.flow';
import { TicketsFlow } from './flows/tickets.flow';
import { ConversationStateMachine } from './conversation.state-machine';

@Injectable()
export class FlowRegistry {
  private usersFlow = new Map<string, string>(); // userId → flowName
  private stateMachines = new Map<string, ConversationStateMachine>();

  private flows: Record<string, any>;

  constructor(
    private readonly registerFlow: RegisterFlow,
    private readonly ticketsFlow: TicketsFlow,
  ) {
    this.flows = {
      register: this.registerFlow,
      tickets: this.ticketsFlow,
    };
  }

  getFlowForUser(userId: string) {
    const flowName = this.usersFlow.get(userId);
    return flowName ? this.flows[flowName] : null;
  }

  setFlowForUser(userId: string, flowName: string) {
    this.usersFlow.set(userId, flowName);
  }

  getStateMachine(userId: string): ConversationStateMachine {
  let machine = this.stateMachines.get(userId);

  if (!machine) {
    machine = new ConversationStateMachine();
    this.stateMachines.set(userId, machine);
  }

  return machine;
}


  getFlowByName(name: string) {
    return this.flows[name];
  }
}
