import type MenuDomBuilder from "../../builders/dom/MenuDomBuilder";
import CustomEvents from "../../events/CustomEvents";
import type EventHandler from "../../interface/EventHandler";
import type NodeViewModel from "../../viewmodel/NodeViewModel";

export default class MoveNodeEventListener implements EventHandler<Node> {
  private dragged_node: string | null = null;
  node_vm: NodeViewModel;
  node_db: MenuDomBuilder;
  bus: CustomEvents;
  drawing: boolean;
  private lastX = 0;
  private lastY = 0;
  constructor(
    node_vm: NodeViewModel,
    node_db: MenuDomBuilder,
    bus: CustomEvents,
  ) {
    this.node_vm = node_vm;
    this.node_db = node_db;
    this.bus = bus;
    this.drawing = false;

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

  private on_mouse_down = (event: MouseEvent) => {
    const target = (event.target as HTMLElement).closest(".node");
    if (!target) return;
    this.dragged_node = target.id;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  };

  private on_mouse_move = (event: MouseEvent) => {
    if (!this.dragged_node) return;
    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.node_vm.addMoveEventListener(dx, dy, this.dragged_node);
  };

  private on_mouse_up = () => {
    this.dragged_node = null;
  };
  remove_action = () => {
    document.removeEventListener("mousedown", this.on_mouse_down);
    document.removeEventListener("mousemove", this.on_mouse_move);
    document.removeEventListener("mouseup", this.on_mouse_up);
    this.bus.removeEventListener(
      "node:position:update",
      this.on_position_update,
    );
  };

  on_bus_events = () => {
    this.bus.addEventListener("node:position:update", this.on_position_update);
  };

  action = () => {
    document.addEventListener("mousedown", this.on_mouse_down);

    document.addEventListener("mousemove", this.on_mouse_move);

    document.addEventListener("mouseup", this.on_mouse_up);
  };

  set_node_coordinates() {}
}
