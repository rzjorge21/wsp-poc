import { Injectable } from '@nestjs/common';

function askName() {
  return '¿Cuál es tu nombre?';
}
function showConfirmation() {
  console.log('CONFIRMADO');
}
function askDni() {
  return '¿Cuál es tu DNI?';
}
function isNumeric(data) {
  return Number.isInteger(data);
}

export const registrationFlow = {
  initial: 'REGISTER_ASK_NAME',
  states: {
    REGISTER_ASK_NAME: {
      response: askName(),
      next: () => 'REGISTER_ASK_DNI',
      extractData: (msg) => ({ name: msg }),
    },
    REGISTER_ASK_DNI: {
      response: askDni(),
      validate: isNumeric,
      next: () => 'REGISTER_CONFIRM_DNI',
      extractData: (msg) => ({ dni: msg }),
    },
    REGISTER_CONFIRM_DNI: {
      response: showConfirmation(),
      next: (input) => (input == 1 ? 'REGISTER_ASK_EMAIL' : 'REGISTER_ASK_DNI'),
    },
  },
};

@Injectable()
export class RegisterFlow {
  name = 'register';

  handle(msg, stateMachine) {
    const state = stateMachine.getState();
    const context = stateMachine.getContext();

    if (state === 'idle') {
      stateMachine.setState('askName');
      return { reply: '¿Cuál es tu nombre?' };
    }

    if (state === 'askName') {
      stateMachine.setContext('name', msg.text);
      stateMachine.setState('askDNI');
      return { reply: `¿Cuál es tu DNI?` };
    }

    if (state === 'askDNI') {
      stateMachine.setContext('dni', msg.text);
      stateMachine.setState('done');
      return { reply: `¡Registrado! Bienvenido ${JSON.stringify(context)}` };
    }

    return { reply: 'Registro completado 👍' };
  }
}
