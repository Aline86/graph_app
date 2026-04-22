import App from "../App";
import type CustomEvents from "../events/CustomEvents";
import type Button from "../model/Button";
import type ButtonViewModel from "../viewmodel/ButtonViewModel";

const buttonStatus = {
  unvisible: "none",
  active: "active",
  inactive: "inactive",
} as const;

type ButtonStatusKey = keyof typeof buttonStatus;
type ButtonStatusValue = (typeof buttonStatus)[ButtonStatusKey];

export default class ButtonFactory {
  private static button_vm: ButtonViewModel;
  private static bus: CustomEvents;

  static init(button_vm: ButtonViewModel, bus: CustomEvents): void {
    ButtonFactory.button_vm = button_vm;
    ButtonFactory.bus = bus;
  }

  static create_button(
    trigger_action: string,
    label: string,
    id: string,
    action: (button?: Button) => void,
    container: string,
    status: string = "unvisible",
  ) {
    const button = document.createElement("button");
    button.innerHTML = label;
    button.id = id;
    const s: ButtonStatusValue =
      buttonStatus[status as ButtonStatusKey] ?? "none";
    button.className = s;

    const B = ButtonFactory.button_vm.create_button(id);
    ButtonFactory.button_vm.change_button_state(B.id, status);

    document.getElementById(container)?.appendChild(button);
    if (trigger_action !== "") {
      button.addEventListener(trigger_action, (e) => {
        App.activeActionKey = id;
        action(B);
        ButtonFactory.bus.deactivate_all_actions();
        if ((e.target as HTMLElement)?.id !== undefined) {
          ButtonFactory.button_vm.toggle_state_state(
            (e.target as HTMLElement)?.id,
          );
        }
      });
    }
    return B;
  }
}
