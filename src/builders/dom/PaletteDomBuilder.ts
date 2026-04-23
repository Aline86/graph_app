import type CustomEvents from "../../events/CustomEvents";
import ButtonFactory from "../../factory/ButtonFactory";
import Button from "../../model/Button";
import type Graph from "../../model/Graph";
import type { FigureAction } from "../../registry/FigureRegistry";
import FigureRegistry from "../../registry/FigureRegistry";
import type DomBuilder from "./DomBuilder";

export default class PaletteDomBuilder implements DomBuilder<Button> {
  actions: FigureAction[] | undefined;
  container: HTMLElement;
  bus: CustomEvents;
  graph: Graph;
  constructor(container: HTMLElement, bus: CustomEvents, graph: Graph) {
    this.bus = bus;
    this.container = container;
    this.actions = [];
    this.graph = graph;
    this.change_button_color();
    this.add();
    this.activate_buttons();
    this.load_buttons();
  }
  load_buttons = () => {
    if (Object.keys(this.graph.nodes).length > 0) {
      this.bus.activate_buttons();
    }
  };
  add = () => {
    const actions = FigureRegistry.get("palette");

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

  activate_buttons = () => {
    this.bus.addEventListener("activate:buttons", () => {
      const actions = FigureRegistry.get("palette");

      if (actions)
        for (const action of actions) {
          ButtonFactory.button_vm.change_button_state(action.id, "none");
          ButtonFactory.button_vm.toggle_state_state(action.id);
        }
    });
  };
  change_button_color() {
    this.bus.addEventListener("button:color:change", (e) => {
      const button = (e as CustomEvent).detail;
      const B = button.button;
      this.update_button_state(B.id, B.state);
    });
  }
}
