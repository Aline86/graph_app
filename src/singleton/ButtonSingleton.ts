import type CustomEvents from "../events/CustomEvents";
import type Button from "../model/Button";
import type ButtonViewModel from "../viewmodel/ButtonViewModel";

const buttonStatus = {
  unvisible: "none",
  active: "active",
  activated: "activated",
} as const;

type ButtonStatusKey = keyof typeof buttonStatus;
type ButtonStatusValue = (typeof buttonStatus)[ButtonStatusKey];

export default class ButtonSingleton {
  public static button_vm: ButtonViewModel;

  private static bus: CustomEvents;

  static init(button_vm: ButtonViewModel, bus: CustomEvents): void {
    ButtonSingleton.button_vm = button_vm;
    ButtonSingleton.bus = bus;
  }

  static create_button(
    trigger_action: string,
    label: string,
    id: string,
    class_name: string,
    action: (button?: Button) => void,
    container: string,
    status: string,
    toggleable: boolean = true,
  ) {
    const bus = ButtonSingleton.bus;
    const button_vm = ButtonSingleton.button_vm;
    const button = document.createElement("button");
    button.innerHTML = label;
    button.id = id;
    const s: ButtonStatusValue =
      buttonStatus[status as ButtonStatusKey] ?? "none";
    button.className = class_name + " " + s;
    const B = button_vm.create_button(id);
    button_vm.change_button_state(B.id, status);

    document.getElementById(container)?.appendChild(button);

    if (trigger_action !== "") {
      button.addEventListener(trigger_action, (e) => {
        bus.deactivate_all_actions();
        if ((e.target as HTMLElement)?.id !== undefined) {
          button_vm.toggle_state_state((e.target as HTMLElement)?.id);
        }

        if (B.state === "activated" || !toggleable) {
          bus.active_action_key = id;
          action(B);
        } else {
          bus.active_action_key = null;
        }
      });
    }
    return B;
  }
}
