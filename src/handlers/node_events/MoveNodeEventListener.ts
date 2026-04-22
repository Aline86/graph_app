import type MenuDomBuilder from "../../builders/dom/MenuDomBuilder";
import CustomEvents from "../../events/CustomEvents";
import type EventHandler from "../../interface/EventHandler";
import type NodeViewModel from "../../viewmodel/NodeViewModel";

export default class MoveNodeEventListener implements EventHandler<Node> {
  private draggingNode: string | null = null;
  node_vm: NodeViewModel;
  node_db: MenuDomBuilder;
  bus: CustomEvents;
  private drawing = false;
  constructor(
    node_vm: NodeViewModel,
    node_db: MenuDomBuilder,
    bus: CustomEvents,
  ) {
    this.node_vm = node_vm;
    this.node_db = node_db;
    this.bus = bus;

    bus.addEventListener("arrow:drawing:start", () => {
      this.drawing = true;
    });
    bus.addEventListener("arrow:drawing:end", () => {
      this.drawing = false;
    });
    this.on_bus_events();
    this.action();
  }
  private on_position_update = (e: Event) => {
    const node = (e as CustomEvent).detail;
    this.node_db.update_position(node.node);
  };

  private onMouseDown = (event: MouseEvent) => {
    const target = (event.target as HTMLElement).closest(".node");

    if (!target) return;

    this.draggingNode = target.id;
  };

  private onMouseMove = (event: MouseEvent) => {
    if (!this.draggingNode) return;

    this.node_vm.addMoveEventListener(event, this.draggingNode);
  };

  private onMouseUp = () => {
    this.draggingNode = null;
  };
  remove_action = () => {
    document.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
    this.bus.removeEventListener(
      "node:position:update",
      this.on_position_update,
    );
  };

  on_bus_events = () => {
    this.bus.addEventListener("node:position:update", this.on_position_update);
  };

  action = () => {
    document.addEventListener("mousedown", this.onMouseDown);

    document.addEventListener("mousemove", this.onMouseMove);

    document.addEventListener("mouseup", this.onMouseUp);
  };

  set_node_coordinates() {}
}
