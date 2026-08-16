import CustomEvents from "../events/CustomEvents";
import Arrow from "../model/Arrow";
import type Graph from "../model/Graph";
import Node from "../model/Node";

export default class ArrowViewModel {
  graph: Graph;
  last_target: string | null;
  public bus: CustomEvents;
  constructor(graph: Graph, bus: CustomEvents) {
    this.graph = graph;

    this.last_target = null;
    this.bus = bus;
  }

  remove_arrow(target: string) {
    const arrow = this.graph.arrows[target];
    delete this.graph.arrows[target];
    this.bus.trigger_remove_arrow(arrow);
  }
  add_end_node = (target: Node, arrow: Arrow): void => {
    if (
      this.graph.nodes[target.id] !== undefined &&
      target.id !== arrow.start_node.id
    ) {
      this.graph.nodes[target.id].position.x = target.position.x;
      this.graph.nodes[target.id].position.y = target.position.y;
      arrow.set_end_node(this.graph.nodes[target.id]);

      this.bus.trigger_draw_arrow(arrow);
    } else {
      delete this.graph.arrows[arrow.id];
      this.bus.trigger_remove_arrow(arrow);
    }
  };
  is_adequate_target(target: string) {
    return this.graph.nodes[target] !== undefined;
  }

  get_last_target() {
    return this.last_target;
  }

  create_arrow(target: string) {
    const node = this.graph.nodes[target];
    if (!node) return;
    const arrow = new Arrow(node);
    this.graph.arrows[arrow.id] = arrow;
    return arrow;
  }

  set_pointer_target = (x: number, y: number, arrow: Arrow) => {
    arrow.end_tmp.x = x;
    arrow.end_tmp.y = y;

    this.bus.trigger_draw_arrow(arrow);
  };
}
