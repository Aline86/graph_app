import type MenuDomBuilder from "../../builders/dom/MenuDomBuilder";
import CustomEvents from "../../events/CustomEvents";
import type EventHandler from "../../interface/EventHandler";
import type Node from "../../model/Node";

import type NodeViewModel from "../../viewmodel/NodeViewModel";

export default class RemoveNodeEventListener implements EventHandler<Node> {
  private inputChange?: (e: Event) => void;

  node_vm: NodeViewModel;
  node_db: MenuDomBuilder;
  bus: CustomEvents;
  activeNode: string | null = null;
  constructor(
    node_vm: NodeViewModel,
    node_db: MenuDomBuilder,
    bus: CustomEvents,
  ) {
    this.bus = bus;
    this.node_vm = node_vm;
    this.node_db = node_db;
    this.on_bus_events();
  }

  remove_action = () => {
    const el = document.getElementById(this.activeNode + "_input");
    if (!el) return;
    if (!this.inputChange) return;
    el.removeEventListener("change", this.inputChange);
    this.inputChange = undefined;
  };

  on_bus_events = () => {
    this.bus.addEventListener("remove:node", (e: Event) => {
      const node = (e as CustomEvent).detail;
      this.action(node.node);
    });
  };

  action = (node?: Node) => {
    if (!node) return;
    this.node_db.delete(node);
  };

  set_node_coordinates() {}
}
