import type CustomEvents from "../events/CustomEvents";
import type Module from "../interface/Module";
import type Graph from "../model/Graph";
import FigureRegistry from "../registry/FigureRegistry";
import GraphView from "../view/GraphView";
import ArrowModule from "./ArrowModule";
import NodeModule from "./NodeModule";

export default class GraphModule implements Module {
  graph: Graph;
  constructor(graph: Graph) {
    this.graph = graph;
  }

  install(bus: CustomEvents, container: HTMLElement) {
    const graph = new GraphView(container, this.graph, bus);
    FigureRegistry.register({
      actions_id: container.id + "_menu_node",
      name: "Supprimer le noeud",
      class_name: "remove_node",
      action: "click",
      id: this.graph.id + "_" + "remove_node",
      mode: "active",
      handler: graph.graph_handler.remove_node,
    });

    const arrow_module = new ArrowModule(this.graph);
    arrow_module.install(bus, container);

    const node_module = new NodeModule(this.graph);
    node_module.install(bus, container);
    graph.load_graph();
  }
}
