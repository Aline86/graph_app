import type CustomEvents from "../../events/CustomEvents";
import ButtonFactory from "../../factory/ButtonFactory";

import Button from "../../model/Button";
import type Graph from "../../model/Graph";
import type { FigureAction } from "../../registry/FigureRegistry";
import FigureRegistry from "../../registry/FigureRegistry";
import type ButtonViewModel from "../../viewmodel/ButtonViewModel";
import type DomBuilder from "./DomBuilder";

export default class PaletteDomBuilder implements DomBuilder<Button> {
  actions: FigureAction[] | undefined;
  container: HTMLElement;
  bus: CustomEvents;
  graph: Graph;
  button_factory: ButtonFactory;
  button_vm: ButtonViewModel;

  constructor(
    container: HTMLElement,
    bus: CustomEvents,
    graph: Graph,
    buttons: Button,
    button_vm: ButtonViewModel,
  ) {
    this.bus = bus;
    this.container = container;
    this.actions = [];
    this.graph = graph;
    this.button_factory = new ButtonFactory(bus, buttons);
    this.button_vm = button_vm;

    this.add();
    this.activate_buttons();
    this.load_buttons();
    this.change_button_color();
  }
  load_buttons = () => {
    if (Object.keys(this.graph.nodes).length > 0) {
      this.button_vm.show_buttons();
    }
  };
  add = () => {
    const actions = FigureRegistry.get(this.graph.id + "_palette");

    if (actions)
      for (const action of actions) {
        this.button_factory.create_button(
          action.action,
          action.name,
          action.id,
          action.class_name,
          action.handler,
          this.container.id + "_palette_container",
          action.mode,
        );
      }
  };

  update_button_state = (id: string, state: string): void => {
    const el = document.getElementById(id);

    if (!el) return;
    el.classList.remove("none", "active", "activated");
    el.classList.add(state);
  };

  update = () => {};
  delete = () => {};

  change_button_color() {
    this.bus.addEventListener("button:color:change", (e) => {
      const button = (e as CustomEvent).detail;
      const B = button.button;

      this.update_button_state(B.id, B.state);
    });
  }

  activate_buttons = () => {
    this.bus.addEventListener("activate:buttons", () => {
      const actions = FigureRegistry.get(this.graph.id + "_palette");

      if (actions)
        for (const action of actions) {
          this.button_vm.change_button_state(action.id, action.mode);
          this.button_vm.toggle_state_state(action.id);
        }
    });
  };
}
