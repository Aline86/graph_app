import type CustomEvents from "../events/CustomEvents";
import Button from "../model/Button";
import type Graph from "../model/Graph";

export default class ButtonViewModel {
  bus: CustomEvents;
  graph: Graph;
  constructor(graph: Graph, bus: CustomEvents) {
    this.bus = bus;
    this.graph = graph;
  }
  get_button = (id: string) => {
    const button = Button.get(id);
    if (button) {
      return button;
    }
  };
  change_button_state = (id: string, state: string) => {
    const button = Button.get(id);
    if (button) {
      button.set_state(state);
    }
  };
  is_adequate_target_for_arrow(target: string) {
    return this.graph.nodes[target] !== undefined;
  }
  toggle_state_state = (id: string) => {
    const button = Button.get(id);
    if (button) {
      if (button.state === "none" || button.state === "inactive") {
        button.set_state("active");
      } else {
        button.set_state(button.state === "activated" ? "active" : "activated");
      }
      this.deactivate_other_buttons(button.id);
      this.notify_button(button);
    }
  };
  deactivate_other_buttons(id: string) {
    for (const button of Button.buttons) {
      if (button.id === id) continue;
      button.set_state("active");
      this.notify_button(button);
    }
  }
  create_button(name: string) {
    const button = new Button(name);

    return button;
  }
  notify_button(button: Button) {
    this.bus.notify_button_state_change(button);
  }
}
