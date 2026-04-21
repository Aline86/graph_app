import type CustomEvents from "../../events/CustomEvents";
import type Arrow from "../../model/Arrow";
import type Node from "../../model/Node";
import type DomBuilder from "./DomBuilder";

export default class GraphDomBuilder implements DomBuilder<Node> {
  private container: HTMLElement;
  private bus: CustomEvents;

  constructor(container: HTMLElement, bus: CustomEvents) {
    this.container = container;
    this.bus = bus;

    this.on_remove_node();
    this.on_remove_arrow();
  }

  update = (): void => {};

  add = (): void => {};

  delete = (node?: Node): void => {
    if (!node) return;
    this.remove_node_from_dom(node.id);
  };

  private remove_node_from_dom(node_id: string): void {
    const el = document.getElementById(node_id);
    el?.remove();
  }

  remove_arrow_from_dom(arrow: Arrow): void {
    document.getElementById(arrow.id + "-svg")?.remove();
  }

  append_node(node_el: HTMLElement): void {
    this.container.appendChild(node_el);
  }

  private on_remove_node(): void {
    this.bus.addEventListener("remove:node", (e: Event) => {
      const { node } = (e as CustomEvent<{ node: Node }>).detail;
      this.delete(node);
    });
  }

  private on_remove_arrow(): void {
    this.bus.addEventListener("remove:arrow", (e: Event) => {
      const { arrow } = (e as CustomEvent<{ arrow: Arrow }>).detail;
      this.remove_arrow_from_dom(arrow);
    });
  }
}
