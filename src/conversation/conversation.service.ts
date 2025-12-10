import { Injectable, Logger } from '@nestjs/common';
import { FlowRegistry } from './conversation.flow-registry';
import { NormalizedMessage } from '../shared/adapters/message.types';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  constructor(private readonly flowRegistry: FlowRegistry) {}

  handleMessage(msg: NormalizedMessage) {
    const userId = msg.senderPhone;

    // 1. Obtener flujo
    let flow = this.flowRegistry.getFlowForUser(userId);
    // const machine = this.flowRegistry.getStateMachine(userId);

    // console.log('FLOW', flow);
    // console.log('MACHINE', machine);

    // // 2. Si no hay flujo: asignar y setear estado inicial sí o sí
    // if (!flow) {
    //   flow = this.flowRegistry.getFlowByName('register');
    //   this.flowRegistry.setFlowForUser(userId, flow.name);
    //   machine.setState(flow.definition.initial);
    // }

    // console.log('new machine', machine);

    // // 3. Si hay flow pero la machine está en "idle", corregirlo
    // if (machine.getState() === 'idle') {
    //   machine.setState(flow.definition.initial);
    // }

    // const state = machine.getState();
    // console.log('STATES', state);
    // const node = flow.definition.states[state];

    // if (!node) {
    //   return { reply: `⚠️ Estado inválido (${state}). Reiniciando flujo.` };
    // }

    // // VALIDACIÓN
    // if (node.validate && !node.validate(msg)) {
    //   return { reply: '❌ Valor inválido, intenta nuevamente.' };
    // }

    // // EXTRAER DATA
    // if (node.extractData) {
    //   const data = node.extractData(msg);
    //   machine.mergeContext(data);
    // }

    // // RESPUESTA
    // const reply =
    //   typeof node.response === 'function'
    //     ? node.response(machine.getContext())
    //     : node.response;

    // const nextState =
    //   typeof node.next === 'function'
    //     ? node.next(msg, machine.getContext())
    //     : node.next;

    // if (nextState) {
    //   machine.setState(nextState);
    // }

    // return { reply };

    // Si no existe flujo para este usuario, seleccionamos uno según mensaje
    if (!flow) {
      if (msg.text?.startsWith('registro')) {
        this.flowRegistry.setFlowForUser(userId, 'register');
      } else if (msg.text?.startsWith('ticket')) {
        this.flowRegistry.setFlowForUser(userId, 'tickets');
      } else {
        return { reply: '🤖 No entendí. Escribe "registro" o "ticket".' };
      }

      flow = this.flowRegistry.getFlowForUser(userId);
    }
    const flowInstance = this.flowRegistry.getFlowByName(flow.name);
    const stateMachine = this.flowRegistry.getStateMachine(userId);

    console.log("STATE MACHINE", stateMachine)

    const result = flowInstance.handle(msg, stateMachine);
    return result;
  }
}
