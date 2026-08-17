import type CustomEvents from "../events/CustomEvents";
import Button from "../model/Button";

export default class ButtonViewModel {
  bus: CustomEvents;
  buttons: Button;

  constructor(bus: CustomEvents, buttons: Button) {
    this.bus = bus;
    this.buttons = buttons;
  }
  get_button = (id: string) => {
    const button = this.buttons.get(id);
    if (button) {
      return button;
    }
  };
  change_button_state = (id: string, state: string) => {
    const button = this.buttons.get(id);
    if (button) {
      button.set_state(state);
    }
  };

  toggle_state_state = (id: string) => {
    const button = this.buttons.get(id);
    if (button) {
      if (button.state === "none" || button.state === "inactive") {
        button.set_state("active");
        this.notify_button(button);
      } else {
        if (button.id) this.deactivate_other_buttons(button);
      }
    }
  };
  show_buttons() {
    this.bus.activate_buttons();
  }
  deactivate_other_buttons(button: Button) {
    for (const _id in this.buttons.buttons) {
      if (_id === button.id) {
        button.set_state("activated");
        this.notify_button(button);
      } else {
        this.buttons.get(_id).set_state("active");
        this.notify_button(this.buttons.get(_id));
      }
    }
  }
  create_button() {
    return this.buttons.add();
  }
  notify_button(button: Button) {
    this.bus.notify_button_state_change(button);
  }
}
