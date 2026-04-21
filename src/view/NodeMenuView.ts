import CustomEvents from "../events/CustomEvents";
import type Graph from "../model/Graph";
import FigureRegistry from "../registry/FigureRegistry";

export default class NodeMenuView {
  bus: CustomEvents;
  container: HTMLElement | null = null;

  graph: Graph;

  constructor(graph: Graph, bus: CustomEvents) {
    this.bus = bus;
    this.graph = graph;
  }

  add_event_listener_to_button(button_id: string, key: string) {
    const button = document.getElementById(button_id);
    if (!button) return;
    const action = FigureRegistry.get_action_by_id(key);
    if (!action) return;
    button.addEventListener(action.action, action.handler);
  }
}
