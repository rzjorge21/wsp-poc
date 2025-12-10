export class ConversationStateMachine {
  state = 'idle';
  context: Record<string, any> = {};

  constructor(initialState = 'idle') {
    this.state = initialState;
  }

  setState(newState: string) {
    this.state = newState;
  }

  getState() {
    return this.state;
  }

  setContext(key: string, value: any) {
    this.context[key] = value;
  }

  getContext(key: string) {
    return this.context[key];
  }
}
