import MenuDomBuilder from "../builders/dom/MenuDomBuilder";
import type CustomEvents from "../events/CustomEvents";
import type NodeViewModel from "../viewmodel/NodeViewModel";
import AddNodeButtonEventListener from "./buttons/AddNodeButtonEventListener";
import MoveNodeEventListener from "./node_events/MoveNodeEventListener";

export default class NodeEventHandler {
  node_vm: NodeViewModel;
  node_db: MenuDomBuilder;
  move_listener: MoveNodeEventListener;

  container: HTMLElement;
  constructor(
    node_vm: NodeViewModel,
    node_db: MenuDomBuilder,
    bus: CustomEvents,
    container: HTMLElement,
  ) {
    this.container = container;
    this.node_vm = node_vm;
    this.node_db = node_db;

    this.move_listener = new MoveNodeEventListener(this.node_vm, node_db, bus);

    new AddNodeButtonEventListener(this.node_vm, this.node_db, bus, container);
  }

  destroy() {
    this.move_listener.remove_action();
  }
}
