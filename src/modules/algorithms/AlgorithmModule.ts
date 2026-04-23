import type AlgorithmEvents from "../../events/AgorithmEvents";
import type Module from "../../interface/Module";
import type Graph from "../../model/Graph";
import FigureRegistry from "../../registry/FigureRegistry";
import GraphView from "../../view/GraphView";
import BFSModule from "./bfs/BFSModule";

export default class AlgorithmModule implements Module {
  graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  install(bus: AlgorithmEvents, container: HTMLElement) {
    const bfs_module = new BFSModule(this.graph, bus, container);

    FigureRegistry.register({
      actions_id: GraphView.graph_id,
      name: "Play BFS",
      action: "click",
      id: "play_bfs",
      handler: bfs_module.run,
    });
  }
}
