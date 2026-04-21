import type CustomEvents from "../events/CustomEvents";
import type Arrow from "../model/Arrow";
import type Node from "../model/Node";
import Position from "../model/Position";
import FigureRegistry from "../registry/FigureRegistry";
import DomUtils from "../utils/DomUtils";
import ArrowView from "../view/ArrowView";
import type ArrowViewModel from "../viewmodel/ArrowViewModel";

type ArrowState = {
  status: "drawing" | "still";
  arrow: Arrow | null;
  handler: ((e: MouseEvent) => void) | null;
};

export default class ArrowEventHandler extends DomUtils {
  private state: ArrowState = { status: "still", arrow: null, handler: null };
  arrow_vm: ArrowViewModel;
  container: string;
  bus: CustomEvents;
  constructor(arrow_vm: ArrowViewModel, container: string, bus: CustomEvents) {
    super();
    this.arrow_vm = arrow_vm;
    this.container = container;
    this.bus = bus;

    FigureRegistry.register({
      actions_id: ArrowView.actions_id,
      id: "button_draw_arrow",
      name: "dessiner les flèches",
      action: "click",
      handler: this.detect_click,
    });
  }

  detect_click = (node?: Node) => {
    if (!node) return;
    this.state.status === "still"
      ? this.start_drawing(node)
      : this.finish_drawing(node);
  };

  private start_drawing(node: Node) {
    const arrow = this.create_arrow(node.id);
    if (!arrow) return;

    const handler = (e: MouseEvent) =>
      this.arrow_vm.addDrawArrowEventListener(e, arrow);
    document.addEventListener("mousemove", handler);

    this.state = { status: "drawing", arrow, handler };
    this.bus.trigger_arrow_drawing_start();
  }

  private finish_drawing(node: Node) {
    const { arrow, handler } = this.state;
    if (!handler || !arrow) return;

    const pos = this.get_target_position(node.id);
    if (pos) this.arrow_vm.add_end_node(node, arrow, pos.x, pos.y);

    document.removeEventListener("mousemove", handler);
    this.state = { status: "still", arrow: null, handler: null };
    this.bus.trigger_arrow_drawing_end();
  }

  private create_arrow(target: string) {
    const el = document.getElementById(target);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return this.arrow_vm.create_arrow(
      target,
      new Position(rect.left + window.scrollX, rect.top + window.scrollY),
    );
  }
}
