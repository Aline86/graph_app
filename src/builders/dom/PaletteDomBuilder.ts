import type CustomEvents from "../../events/CustomEvents";
import ButtonFactory from "../../factory/ButtonFactory";
import Button from "../../model/Button";
import type { FigureAction } from "../../registry/FigureRegistry";
import FigureRegistry from "../../registry/FigureRegistry";
import type DomBuilder from "./DomBuilder";

export default class PaletteDomBuilder implements DomBuilder<Button> {
  actions: FigureAction[];
  container: HTMLElement;
  bus: CustomEvents;

  constructor(container: HTMLElement, bus: CustomEvents) {
    this.bus = bus;
    this.container = container;
    this.actions = [];

    const drawArrow = FigureRegistry.get_action_by_id("button_draw_arrow");
    if (drawArrow) {
      this.actions.push(drawArrow);
    }

    this.change_button_color();
    this.add();
    this.activate_buttons();
  }

  add = () => {
    const actions = this.actions;
    if (actions)
      for (const action of actions) {
        ButtonFactory.create_button(
          action.action,
          action.name,
          action.id,
          action.handler,
          "button_container",
        );
      }
  };

  update_button_state = (id: string, state: string): void => {
    const el = document.getElementById(id);

    if (el) el.className = state;
  };

  update = () => {};
  delete = () => {};

  activate_buttons() {
    this.bus.addEventListener("activate:buttons", () => {
      const actions = this.actions;
      if (actions)
        for (const action of actions) {
          this.update_button_state(action.id, "active");
        }
    });
  }
  change_button_color() {
    this.bus.addEventListener("button:color:change", (e) => {
      const button = (e as CustomEvent).detail;
      const B = button.button;
      this.update_button_state(B.id, B.state);
    });
  }
}
