import type AlgorithmEvents from "../../events/AgorithmEvents";
import type Module from "../../interface/Module";
import type Button from "../../model/Button";
import type Graph from "../../model/Graph";
import BFSModule from "./bfs/BFSModule";

export default class AlgorithmModule implements Module {
  graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  install(bus: AlgorithmEvents, container: HTMLElement, buttons: Button) {
    new BFSModule(this.graph, bus, container, buttons);
  }
}
