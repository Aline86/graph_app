import type CustomEvents from "../events/CustomEvents";
import Button from "../model/Button";

import ButtonViewModel from "../viewmodel/ButtonViewModel";

const buttonStatus = {
  unvisible: "none",
  active: "active",
  activated: "activated",
} as const;

type ButtonStatusKey = keyof typeof buttonStatus;
type ButtonStatusValue = (typeof buttonStatus)[ButtonStatusKey];

export default class ButtonFactory {
  private bus: CustomEvents;
  public button_vm: ButtonViewModel;
  buttons: Button;

  constructor(bus: CustomEvents, buttons: Button) {
    this.bus = bus;
    this.buttons = buttons;
    this.bus = bus;
    this.button_vm = new ButtonViewModel(bus, this.buttons);
  }

  create_button(
    trigger_action: string,
    label: string,
    id: string,
    class_name: string,
    action: (button?: Button) => void,
    container: string,
    status: string,
    toggleable: boolean = true,
  ) {
    const bus = this.bus;

    const button = document.createElement("button");
    button.innerHTML = label;

    const s: ButtonStatusValue =
      buttonStatus[status as ButtonStatusKey] ?? "none";
    button.className = class_name + " " + s;

    if (button) {
      let B;
      if (id) {
        B = this.buttons.add(id);
        if (!B.id) throw new Error("no id");
        button.setAttribute("id", B.id);
      } else {
        B = this.buttons.add();
        if (B.id) button.setAttribute("id", B.id);
      }
      if (!B.id) throw new Error("no id");

      document.getElementById(container)?.appendChild(button);
 
        if (trigger_action !== "") {
          button.addEventListener(trigger_action, () => {
            this.bus.deactivate_all_actions();
            if (toggleable) this.button_vm.toggle_state_state(button.id);

            bus.active_action_key = button.id;
            action(B);
          });
        }
      return B;
    }
  }
}
