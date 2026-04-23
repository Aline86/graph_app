import CustomEvents from "../events/CustomEvents";
import Arrow from "../model/Arrow";
import type Graph from "../model/Graph";
import Node from "../model/Node";
import type Position from "../model/Position";

export default class ArrowViewModel {
  graph: Graph;
  last_target: string | null;
  public bus: CustomEvents;
  constructor(graph: Graph, bus: CustomEvents) {
    this.graph = graph;

    this.last_target = null;
    this.bus = bus;
  }

  create_arrow(target: string, position: Position) {
    if (!this.graph.nodes[target]) return;
    this.graph.nodes[target].set_position(position);
    const arrow = new Arrow(this.graph.nodes[target]);
    this.graph.arrows[arrow.id] = arrow;
    return arrow;
  }
  remove_arrow(target: string) {
    const arrow = this.graph.arrows[target];
    delete this.graph.arrows[target];
    this.bus.trigger_remove_arrow(arrow);
  }
  add_end_node = (target: Node, arrow: Arrow, x: number, y: number): void => {
    if (
      this.graph.nodes[target.id] !== undefined &&
      target.id !== arrow.start_node.id
    ) {
      this.graph.nodes[target.id].position.x = x;
      this.graph.nodes[target.id].position.y = y;
      arrow.set_end_node(this.graph.nodes[target.id]);
      arrow.calculate_length();
      this.bus.trigger_draw_arrow(arrow);
    } else {
      delete this.graph.arrows[arrow.id];
      this.bus.trigger_remove_arrow(arrow);
    }
  };
  is_adequate_target(target: string) {
    return this.graph.nodes[target] !== undefined;
  }
  addDrawArrowEventListener = (e: MouseEvent, arrow: Arrow): void => {
    this.draw_arrow(e, arrow);
  };
  get_last_target() {
    return this.last_target;
  }
  draw_arrow = (e: MouseEvent, arrow: Arrow) => {
    arrow.draw_line(e);

    this.bus.trigger_draw_arrow(arrow);
  };
}
