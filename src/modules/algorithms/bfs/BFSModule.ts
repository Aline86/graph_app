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
  container: HTMLElement;
  constructor(graph: Graph, bus: AlgorithmEvents, container: HTMLElement) {
    this.graph = graph;
    this.container = container;
    this.install();

    this.bfs_logic = new BFSLogic(graph, bus);

    const button_vm = new ButtonViewModel(this.graph, bus);
    const bfs_db = new BFSDomBuilder(button_vm, container, bus);
    new AddBFSButtonEventListener(container, bfs_db);
  }

  install = () => {
    FigureRegistry.register({
      actions_id: this.container.id + "_play_bfs",
      name: "Algorithme BFS",
      id: this.graph.id + "_" + "play_bfs",
      class_name: "play_bfs",
      action: "click",

      mode: "none",
      handler: this.run,
    });
  };
  run = () => {
    this.bfs_logic.trigger_bfs();
  };
}
