import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketsFlow {
  name = 'tickets';

  handle(msg, stateMachine) {
    const state = stateMachine.getState();

    if (state === 'idle') {
      stateMachine.setState('awaitIssue');
      return { reply: '¿Cuál es el problema con tu ticket?' };
    }

    if (state === 'awaitIssue') {
      stateMachine.setContext('issue', msg.text);
      stateMachine.setState('done');
      return { reply: `Perfecto. He registrado el problema: "${msg.text}"` };
    }

    return { reply: 'Tu ticket ya está registrado 🙌' };
  }
}
