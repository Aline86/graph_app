import type CustomEvents from "../../events/CustomEvents";
import type Node from "../../model/Node";
import FigureRegistry from "../../registry/FigureRegistry";
import DomUtils from "../../utils/DomUtils";
import type DomBuilder from "./DomBuilder";

export default class MenuDomBuilder
  extends DomUtils
  implements DomBuilder<Node>
{
  container: HTMLElement;
  bus: CustomEvents;

  constructor(container: HTMLElement, bus: CustomEvents) {
    super();
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

  update_position = (node?: Node): void => {
    if (!node) return;
    const _node = document.getElementById(node.id);

    if (_node) {
      _node.style.left = node.position.x + "px";
      _node.style.top = node.position.y + "px";
      _node.style.position = "absolute";
    }
  };
}
