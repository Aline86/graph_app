import MenuDomBuilder from "../builders/dom/MenuDomBuilder";
import type CustomEvents from "../events/CustomEvents";
import type NodeViewModel from "../viewmodel/NodeViewModel";
import AddNodeButtonEventListener from "./buttons/AddNodeButtonEventListener";
import MoveNodeEventListener from "./node_events/MoveNodeEventListener";

export default class NodeEventHandler {
  node_vm: NodeViewModel;
  menu_db: MenuDomBuilder;
  move_listener: MoveNodeEventListener;
  bus: CustomEvents;
  container: HTMLElement;
  constructor(
    node_vm: NodeViewModel,
    menu_db: MenuDomBuilder,
    bus: CustomEvents,
    container: HTMLElement,
  ) {
    this.container = container;
    this.node_vm = node_vm;
    this.menu_db = menu_db;
    this.bus = bus;
    this.move_listener = new MoveNodeEventListener(this.node_vm, menu_db, bus);

    new AddNodeButtonEventListener(this.node_vm, this.menu_db, bus, container);
  }

  destroy() {
    this.move_listener.remove_action();
  }
}
