import type CustomEvents from "../events/CustomEvents";
import type Arrow from "../model/Arrow";
import type Node from "../model/Node";

import type ArrowViewModel from "../viewmodel/ArrowViewModel";

type ArrowState = {
  status: "drawing" | "still";
  arrow: Arrow | null;
  handler: ((e: MouseEvent) => void) | null;
};

export default class ArrowEventHandler {
  private state: ArrowState = { status: "still", arrow: null, handler: null };
  arrow_vm: ArrowViewModel;
  container: string;
  bus: CustomEvents;
  constructor(arrow_vm: ArrowViewModel, container: string, bus: CustomEvents) {
    this.arrow_vm = arrow_vm;
    this.container = container;
    this.bus = bus;

    this.deactivate_all_actions();
  }

  detect_click = (node?: Node) => {
    if (!node || !this.arrow_vm.is_adequate_target(node.id)) return;
    this.state.status === "still"
      ? this.start_drawing(node)
      : this.finish_drawing(node);
  };
  deactivate_all_actions = () => {
    this.bus.addEventListener("deactivate:actions", () => {
      if (this.state.arrow) {
        this.arrow_vm.remove_arrow(this.state.arrow.id);
      }
      if (this.state.handler) {
        document.removeEventListener("mousemove", this.state.handler);
      }
      this.state = { status: "still", arrow: null, handler: null };
    });
  };
  private start_drawing(node: Node) {
    const arrow = this.create_arrow(node.id);
    if (!arrow) return;

    const el = document.getElementById(this.container);
    const rect = el!.getBoundingClientRect();
    const offset_x = rect.left + el!.clientLeft;
    const offset_y = rect.top + el!.clientTop;

    const handler = (e: MouseEvent) =>
      this.arrow_vm.set_pointer_target(
        e.clientX - offset_x,
        e.clientY - offset_y,
        arrow,
      );
    document.addEventListener("mousemove", handler);

    this.state = { status: "drawing", arrow, handler };
    this.bus.trigger_arrow_drawing_start();
  }

  private finish_drawing(node: Node) {
    const { arrow, handler } = this.state;
    if (!handler || !arrow) return;

    this.arrow_vm.add_end_node(node, arrow);

    document.removeEventListener("mousemove", handler);
    this.state = { status: "still", arrow: null, handler: null };
    this.bus.trigger_arrow_drawing_end();
  }

  private create_arrow(target: string) {
    return this.arrow_vm.create_arrow(target);
  }
}
