export default class Button {
  id: string;
  state: string;
  static buttons: Button[] = [];

  constructor(id: string) {
    this.id = id;
    this.state = "unvisible";
    Button.buttons.push(this);
  }
  static get(id: string): Button | undefined {
    return Button.buttons.find((b) => b.id === id);
  }
  set_state(state: string) {
    this.state = state;
  }
}
