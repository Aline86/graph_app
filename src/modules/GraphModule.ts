import type CustomEvents from "../events/CustomEvents";
import type Module from "../interface/Module";
import type Graph from "../model/Graph";
import FigureRegistry from "../registry/FigureRegistry";
import GraphView from "../view/GraphView";
import NodeView from "../view/NodeView";
import ArrowModule from "./ArrowModule";
import NodeModule from "./NodeModule";
import StorageModule from "./StorageModule";

export default class GraphModule implements Module {
  graph: Graph;
  constructor(graph: Graph) {
    this.graph = graph;
    const stored_graph = StorageModule.load();

    if (stored_graph) {
      this.graph.init(stored_graph);
    }
  }

  install(bus: CustomEvents, container: HTMLElement) {
    const graph = new GraphView(container, this.graph, bus);
    const arrow_module = new ArrowModule(this.graph);
    arrow_module.install(bus, container);
    const node_module = new NodeModule(this.graph);
    node_module.install(bus, container);

    FigureRegistry.register({
      actions_id: NodeView.node_id,
      name: "Supprimer le noeud",
      action: "click",
      id: "remove_node",
      handler: graph.graph_handler.remove_node,
    });
    graph.load_graph();
  }
}
