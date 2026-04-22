import type CustomEvents from "../events/CustomEvents";
import type Graph from "../model/Graph";
import ArrowViewModel from "../viewmodel/ArrowViewModel";
import GraphViewModel from "../viewmodel/GraphViewModel";
import GraphDomBuilder from "../builders/dom/GraphDomBuilder";
import GraphEventHandler from "../handlers/GraphEventHandler";

export default class GraphView {
  public static graph_id = "graph_events";
  private arrow_vm: ArrowViewModel;
  private graph_vm: GraphViewModel;
  graph_db: GraphDomBuilder;
  graph_handler: GraphEventHandler;
  bus: CustomEvents;

  constructor(container: HTMLElement, graph: Graph, bus: CustomEvents) {
    this.arrow_vm = new ArrowViewModel(graph, bus);
    this.graph_vm = new GraphViewModel(graph, this.arrow_vm, bus);
    this.bus = bus;
    this.graph_db = new GraphDomBuilder(container, bus);
    this.graph_handler = new GraphEventHandler(
      this.graph_vm,
      this.graph_db,
      bus,
    );
    if (Object.keys(graph.nodes).length > 0) {
      this.bus.activate_buttons();
    }
  }

  load_graph = () => {
    this.graph_vm.load_nodes();
    this.graph_vm.load_arrows();
  };
}
