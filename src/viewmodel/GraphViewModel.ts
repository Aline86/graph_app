import CustomEvents from "../events/CustomEvents";
import type Arrow from "../model/Arrow";
import type Graph from "../model/Graph";
import type ArrowViewModel from "./ArrowViewModel";

export default class GraphViewModel {
  graph: Graph;
  arrow_vm: ArrowViewModel;
  public bus: CustomEvents;
  constructor(graph: Graph, arrow_vm: ArrowViewModel, bus: CustomEvents) {
    this.graph = graph;
    this.arrow_vm = arrow_vm;
    this.bus = bus;
  }

  load_nodes = () => {
    const nodes = this.graph.nodes;
    if (Object.keys(nodes).length > 0)
      for (const key in nodes) {
        if (!Object.hasOwn(nodes, key)) continue;

        const node = nodes[key];
        this.bus.load_node(node);
      }
  };

  load_arrows = () => {
    const arrows = this.graph.arrows;
    if (Object.keys(arrows).length > 0)
      for (const key in arrows) {
        if (!Object.hasOwn(arrows, key)) continue;

        const arrow = arrows[key];
        this.bus.load_arrow(arrow);
      }
  };
  get_linked_arrows(arrow: Arrow, node_id: string) {
    if (arrow.end_node?.id === node_id || arrow.start_node.id === node_id) {
      arrow.calculate_length();

      this.bus.trigger_draw_arrow(arrow);
    }
  }
  add_recalculate_arrow_on_node_move = (node_id: string) => {
    const arrows = this.graph.arrows;

    for (const key in arrows) {
      if (!Object.hasOwn(arrows, key)) continue;

      this.get_linked_arrows(arrows[key], node_id);
    }
  };
  delete_node_arrows(node_id: string) {
    const arrows = this.graph.arrows;

    for (const key in arrows) {
      if (!Object.hasOwn(arrows, key)) continue;
      const arrow = arrows[key];
      if (arrow.start_node.id === node_id || arrow.end_node?.id === node_id) {
        this.bus.trigger_remove_arrow(this.graph.arrows[key]);
        delete this.graph.arrows[key];
      }
    }
  }
  remove_node = (node_id: string): void => {
    if (this.graph.nodes[node_id] !== undefined) {
      const node = this.graph.nodes[node_id];

      delete this.graph.nodes[node_id];
      this.delete_node_arrows(node_id);
      this.bus.remove_node_from_dom(node);
    }
  };
}
