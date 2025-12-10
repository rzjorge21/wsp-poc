import { Injectable } from '@nestjs/common';

// function askName() {
//   return '¿Cuál es tu nombre?';
// }
// function showConfirmation() {
//   console.log('CONFIRMADO');
// }
// function askDni() {
//   return '¿Cuál es tu DNI?';
// }
// function isNumeric(data) {
//   return Number.isInteger(data);
// }

// export const registrationFlow = {
//   initial: 'INITIAL_REGISTER',
//   states: {
//     INITIAL_REGISTER: {
//       response: () => 'Hola cuál es tu nombre?',
//       next: (msg, context) => {
//         console.log('DATA', msg);
//         return 'REGISTER_ASK_NAME';
//       },
//     },
//     REGISTER_ASK_NAME: {
//       response: (ctx) => {
//         console.log('REGISTER_END CTX', ctx);
//         return 'Hola, cuál es tu DNI?';
//       },
//       next: (msg, context) => {
//         // console.log('DATA', msg);
//         return 'REGISTER_ASK_DNI';
//       },
//       extractData: (msg) => ({ name: msg }),
//     },
//     REGISTER_ASK_DNI: {
//       // validate: isNumeric,
//       next: () => 'REGISTER_CONFIRM_INFORMATION',
//       extractData: (msg) => ({ dni: msg }),
//       response: (ctx) => {
//         return `Gracias por comunicarte con nosotros, esta es tu información: \n
//         Nombre: ${ctx.name}\n
//         DNI: ${ctx.dni}\n
//         Esto es correcto? marque 1 para confirmar, 0 en caso contrario`;
//       },
//     },
//     REGISTER_CONFIRM_INFORMATION: {
//       // response: showConfirmation,
//       next: (input) => {
//         console.log('INPUT ', input);
//         return input == '1' ? 'REGISTER_END' : 'INITIAL_REGISTER';
//       },
//     },
//     REGISTER_END: {
//       response: (ctx) => {
//         console.log('REGISTER_END CTX', ctx);
//         return 'Gracias por comunicarte con nosotros';
//       },
//     },
//   },
// };

@Injectable()
export class RegisterFlow {
  name = 'register';

  handle(msg, stateMachine) {
    const state = stateMachine.getState();
    const context = stateMachine.getContext();
    
    if (state === 'idle') {
      stateMachine.setState('askName');
      return {
        reply: `¡Hola!
        Es la primera vez que conversamos. Por favor indícame tu nombre y apellido para poder registrarte en el sistema`,
      };
    }

    if (state === 'askName') {
      stateMachine.setContext('name', msg.text);
      stateMachine.setState('askDNI');
      return {
        reply: `Ahora indícame tu DNI, sin incluir el dígito verificador.
        Ejemplo, si tu DNI es 12345678-9 debes ingresar 12345678`,
      };
    }

    if (state === 'askDNI') {
      stateMachine.setContext('dni', msg.text);
      stateMachine.setState('confirmDNI');
      return { reply: `El DNI ${context.dni} es correcto (marque 1 para confirmar, 0 en caso contrario)` };
    }
    
    if (state === 'confirmDNI') {
      if(msg.text == '1'){
        stateMachine.setState('done');
        return { reply: `Perfecto, esta es tu información: ${context.name} - ${context.dni}` };
      }else{
        stateMachine.setState('askDNI');
        return { reply: `Corrija su DNI` };
      }
    }

    return { reply: 'Registro completado 👍' };
  }
}
