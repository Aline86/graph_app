import type CustomEvents from "../events/CustomEvents";
import type Graph from "../model/Graph";
import ArrowViewModel from "../viewmodel/ArrowViewModel";
import GraphViewModel from "../viewmodel/GraphViewModel";
import GraphDomBuilder from "../builders/dom/GraphDomBuilder";
import GraphEventHandler from "../handlers/GraphEventHandler";

export default class GraphView {
  public static graph_id = "graph_events";

  graph_db: GraphDomBuilder;
  graph_handler: GraphEventHandler;

  constructor(container: HTMLElement, graph: Graph, bus: CustomEvents) {
    const arrow_vm = new ArrowViewModel(graph, bus);
    const graph_vm = new GraphViewModel(graph, arrow_vm, bus);

    this.graph_db = new GraphDomBuilder(container, bus);
    this.graph_handler = new GraphEventHandler(graph_vm, this.graph_db, bus);
  }
}
