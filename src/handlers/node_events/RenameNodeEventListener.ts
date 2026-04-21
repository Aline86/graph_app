import type MenuDomBuilder from "../../builders/dom/MenuDomBuilder";
import CustomEvents from "../../events/CustomEvents";
import type EventHandler from "../../interface/EventHandler";
import type Node from "../../model/Node";

import type NodeViewModel from "../../viewmodel/NodeViewModel";

export default class RenameNodeEventListener implements EventHandler<Node> {
  private inputChange?: (e: Event) => void;
  private currentRenameInput?: HTMLElement;

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
    this.bus.addEventListener("rename:node", (e: Event) => {
      const node = (e as CustomEvent).detail;

      this.node_db.rename(node.node);
    });
  };

  action = (target?: string) => {
    if (!target) return;
    this.activeNode = target;
    const input_el = document.getElementById(target + "_input");
    if (!input_el) return;

    input_el.style.pointerEvents = "auto";

    if (this.currentRenameInput && this.inputChange) {
      this.currentRenameInput.removeEventListener("change", this.inputChange);
    }

    this.inputChange = (event: Event) => {
      this.node_vm.addRenameEventListener(event, target);
    };

    this.currentRenameInput = input_el;
    input_el.addEventListener("change", this.inputChange);
  };

  set_node_coordinates() {}
}
