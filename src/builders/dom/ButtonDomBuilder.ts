import type CustomEvents from "../../events/CustomEvents";
import Button from "../../model/Button";
import type { FigureAction } from "../../registry/FigureRegistry";
import FigureRegistry from "../../registry/FigureRegistry";
import type DomBuilder from "./DomBuilder";

export default class ButtonDomBuilder implements DomBuilder<Button> {
  bus: CustomEvents;

  actions: FigureAction[];
  constructor(bus: CustomEvents) {
    this.bus = bus;

    this.actions = FigureRegistry.getAll();

    this.on_bus_events();
  }

  update = () => {};
  delete = () => {};
  add = (action?: string): void => {
    if (!action) return;

    const method = FigureRegistry.get_action_by_id(action);

    if (method) {
      return method.handler();
    }
  };

  on_bus_events = () => {
    this.bus.addEventListener("button:color:change", (e) => {
      const button = (e as CustomEvent).detail;
      const B = button.button;
      this.change_state_button_in_dom(B.id, B.state);
    });
  };

  change_state_button_in_dom(target: string, state: string): void {
    const element = document.getElementById(target);

    if (element) {
      element.className = state;
    }
  }
}
