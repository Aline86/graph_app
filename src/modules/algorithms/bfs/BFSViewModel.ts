import type AlgorithmEvents from "../../../events/AgorithmEvents";
import type Graph from "../../../model/Graph";

export default class GraphViewModel {
  graph: Graph;

  public bus: AlgorithmEvents;
  constructor(graph: Graph, bus: AlgorithmEvents) {
    this.graph = graph;
    this.bus = bus;
  }

  trigger_highlight_node(node_id: string) {
    if (this.graph.nodes[node_id] !== undefined) {
      this.bus.highlight_node(this.graph.nodes[node_id]);
      this.trigger_wait();
    }
  }
  trigger_reinit_graph() {
    this.bus.trigger_reinit_graph();
  }
  trigger_wait() {
    this.bus.wait();
  }
}
