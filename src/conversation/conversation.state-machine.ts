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

  // getContext(key: string) {
  //   return this.context[key];
  // }

  getContext() { return this.context; }

  // mergeContext(partial: any) {
  //   console.log("CONTEXTO ACTUAL", this.context)
  //   this.context = { ...this.context, ...partial };
  // }
}
