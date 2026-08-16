import type CustomEvents from "../../events/CustomEvents";
import type Node from "../../model/Node";
import FigureRegistry from "../../registry/FigureRegistry";

import type DomBuilder from "./DomBuilder";

export default class MenuDomBuilder implements DomBuilder<Node> {
  container: HTMLElement;
  bus: CustomEvents;

  constructor(container: HTMLElement, bus: CustomEvents) {
  
    this.bus = bus;
    this.container = container;
  }

  update = (node?: Node, action?: string): void => {
    if (!action || !node) return;
    const method = FigureRegistry.get_action_by_id(action);

    if (method) {
      method.handler(node);
    }
  };

  delete = (node?: Node): void => {
    if (!node) return;
    this.remove_node_from_dom(node);
  };
  public remove_node_from_dom = (target?: Node) => {
    if (!target) return;
    const el = document.getElementById(target.id);

    if (el) {
      el.remove();
    }
  };
  add = (): void => {};
  rename = (node?: Node): void => {
    if (!node) return;
    const input = document.getElementById(
      `${node.id}_input`,
    ) as HTMLInputElement | null;

    if (input) {
      input.setAttribute("value", node.name);
    }
  };
}
