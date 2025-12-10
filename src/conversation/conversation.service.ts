import { Injectable, Logger } from '@nestjs/common';
import { FlowRegistry } from './conversation.flow-registry';
import { NormalizedMessage } from '../shared/adapters/message.types';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  constructor(private readonly flowRegistry: FlowRegistry) {}

  handleMessage(msg: NormalizedMessage) {
    // console.log("######################### \n")
    const userId = msg.senderPhone;

    // 1. Obtener flujo
    let flow = this.flowRegistry.getFlowForUser(userId);
  //   const machine = this.flowRegistry.getStateMachine(userId);
  //   console.log("FLOW: ", flow)
  //   console.log("MACHINE: ", machine)
    

  //   // 2. Si no hay flujo: asignar y setear estado inicial sí o sí
  //   if (!flow) {
  //     flow = this.flowRegistry.getFlowByName('register');
      
  //     this.flowRegistry.setFlowForUser(userId, 'register');
  //     machine.setState(flow.initial);
  //   }

  //   // console.log('new machine', machine);

  //   // 3. Si hay flow pero la machine está en "idle", corregirlo
  //   if (machine.getState() === 'idle') {
  //     machine.setState(flow.initial);
  //   }

  //   const state = machine.getState();
  //   console.log('STATE', state);
  //   const node = flow.states[state];

  //   if (!node) {
  //     return { reply: `⚠️ Estado inválido (${state}). Reiniciando flujo.` };
  //   }

  //   // // VALIDACIÓN
  //   // if (node.validate && !node.validate(msg)) {
  //   //   return { reply: '❌ Valor inválido, intenta nuevamente.' };
  //   // }

  //   // EXTRAER DATA
  //   if (node.extractData) {
  //     const data = node.extractData(msg.text);
  //     machine.mergeContext(data);
  //   }

  //   console.log("node", node)

  //   // RESPUESTA del nodo actual (si existe)
  // let reply =
  //   typeof node.response === 'function'
  //     ? node.response(machine.getContext())
  //     : node.response;

  // console.log("reply (current node)", reply)

  // // calcular siguiente estado (si existe)
  // const nextStateComputed =
  //   typeof node.next === 'function'
  //     ? node.next(msg.text, machine.getContext())
  //     : node.next;

  // console.log("nextStateComputed", nextStateComputed)

  // // Si no hay respuesta en el nodo actual pero sí una transición,
  // // hacemos la transición y buscamos la primera response disponible
  // if ((reply === undefined || reply === null || reply === '') && nextStateComputed) {
  //   // límite para evitar loops infinitos
  //   const MAX_JUMPS = 10;
  //   let jumps = 0;
  //   let currentNext = nextStateComputed;

  //   // Seteamos el primer estado de la transición
  //   machine.setState(currentNext);

  //   // Recorremos hasta encontrar un nodo con response o sin next 
  //   while (jumps < MAX_JUMPS) {
  //     const nextNode = flow.states[machine.getState()];
  //     if (!nextNode) {
  //       reply = `⚠️ Estado inválido después de la transición (${machine.getState()}).`;
  //       break;
  //     }

  //     // si el nextNode tiene extractData y queremos ejecutar extracción en transiciones,
  //     // podrías decidir ejecutarla aquí; ahora **no** ejecutamos extractData para transiciones automáticas.

  //     const candidateReply =
  //       typeof nextNode.response === 'function'
  //         ? nextNode.response(machine.getContext())
  //         : nextNode.response;

  //     if (candidateReply !== undefined && candidateReply !== null && candidateReply !== '') {
  //       reply = candidateReply;
  //       break;
  //     }

  //     // si no tiene response, vemos si tiene next para continuar la cadena
  //     const candidateNext =
  //       typeof nextNode.next === 'function'
  //         ? nextNode.next(msg.text, machine.getContext())
  //         : nextNode.next;

  //     if (!candidateNext) {
  //       // No hay respuesta ni next: terminamos sin reply
  //       reply = undefined;
  //       break;
  //     }

  //     // avanzamos al siguiente estado y seguimos buscando
  //     machine.setState(candidateNext);
  //     jumps++;
  //   }

  //   if (jumps >= MAX_JUMPS) {
  //     reply = '⚠️ Demasiadas transiciones automáticas. Revise el flujo.';
  //   }
  // } else {
  //   // Caso normal: si tenía reply (aunque también tenga next), aplicamos la transición a nextStateComputed
  //   if (nextStateComputed) {
  //     machine.setState(nextStateComputed);
  //   }
  // }

  // console.log("final reply", reply)
  // console.log("final state", machine.getState())

  // return { reply };

    // // RESPUESTA
    // const reply =
    //   typeof node.response === 'function'
    //     ? node.response(machine.getContext())
    //     : node.response;

    // console.log("reply", reply)

    // const nextState =
    //   typeof node.next === 'function'
    //     ? node.next(msg.text, machine.getContext())
    //     : node.next;

    // console.log("nextState", nextState)
    // if (nextState) {
    //   machine.setState(nextState);
    // }

    // return { reply };

    // ##########################################

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

    const result = flowInstance.handle(msg, stateMachine);
    return result;
  }
}
