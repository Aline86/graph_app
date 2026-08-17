export default class Button {
  buttons: Record<string, Button> = {};
  state: string;
  id: string | null;
  constructor() {
    this.id = null;

    this.state = "none";
  }

  set_state(state: string) {
    this.state = state;
  }

  add(id?: string): Button {
    const button = new Button();
    if (id) {
      button.id = id;
    } else {
      button.id = crypto.randomUUID();
    }
    this.buttons[button.id] = button;

    return button;
  }
  get(id: string) {

    return this.buttons[id];
  }
  all() {
    return Object.values(this.buttons);
  }
  remove(id: string) {
    delete this.buttons[id];
  }
}
