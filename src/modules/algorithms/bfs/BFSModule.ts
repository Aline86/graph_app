import type Graph from "../../../model/Graph";
import type Module from "../../../interface/Module";
import FigureRegistry from "../../../registry/FigureRegistry";
import ButtonViewModel from "../../../viewmodel/ButtonViewModel";

import AddBFSButtonEventListener from "./AddBFSButtonEventListener";
import BFSDomBuilder from "./BFSDomBuilder";
import type AlgorithmEvents from "../../../events/AgorithmEvents";
import BFSLogic from "./BFSLogic";

export default class BFSModule implements Module {
  graph: Graph;
  bfs_logic: BFSLogic;
  constructor(graph: Graph, bus: AlgorithmEvents, container: HTMLElement) {
    this.graph = graph;
    this.install();
    this.bfs_logic = new BFSLogic(graph, bus);
    const button_vm = new ButtonViewModel(this.graph, bus);
    const bfs_db = new BFSDomBuilder(button_vm, container, bus);
    new AddBFSButtonEventListener(container, bfs_db);
  }
  install = () => {
    FigureRegistry.update_handler("play_bfs", this.run.bind(this));
  };
  run() {
    this.bfs_logic.trigger_bfs();
  }
}
