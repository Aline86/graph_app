import MenuDomBuilder from "../builders/dom/MenuDomBuilder";
import NodeDomBuilder from "../builders/dom/NodeDomBuilder";
import type CustomEvents from "../events/CustomEvents";
import NodeMenuEventHandler from "../handlers/NodeMenuEventHandler";
import type Button from "../model/Button";
import NodeViewModel from "../viewmodel/NodeViewModel";

export default class NodeView {
  container: HTMLElement;
  node_vm: NodeViewModel;
  menu_db: MenuDomBuilder;
  node_db: NodeDomBuilder;
  handler: NodeMenuEventHandler;

  public static node_id = "node_events";

  constructor(
    bus: CustomEvents,
    container: HTMLElement,
    node_vm: NodeViewModel,
    buttons: Button,
  ) {
    this.container = container;
    this.menu_db = new MenuDomBuilder(container, bus);
    this.node_vm = node_vm;
    this.handler = new NodeMenuEventHandler(
      this.node_vm,
      this.menu_db,
      bus,
      container,
    );
    this.node_db = new NodeDomBuilder(bus, container, node_vm, buttons);
  }
}
