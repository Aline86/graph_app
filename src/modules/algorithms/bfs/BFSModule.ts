import type Graph from "../../../model/Graph";
import type Module from "../../../interface/Module";
import FigureRegistry from "../../../registry/FigureRegistry";
import AddBFSButtonEventListener from "./AddBFSButtonEventListener";
import type AlgorithmEvents from "../../../events/AgorithmEvents";
import BFSLogic from "./BFSLogic";
import type Button from "../../../model/Button";
import ButtonFactory from "../../../factory/ButtonFactory";
import BFSDomBuilder from "./BFSDomBuilder";

export default class BFSModule implements Module {
  graph: Graph;
  bfs_logic: BFSLogic;
  container: HTMLElement;
  constructor(
    graph: Graph,
    bus: AlgorithmEvents,
    container: HTMLElement,
    buttons: Button,
  ) {
    this.graph = graph;
    this.container = container;
    this.install();

    this.bfs_logic = new BFSLogic(graph, bus);
    new BFSDomBuilder(this.graph.id, bus, buttons);
    const button_factory = new ButtonFactory(bus, buttons);
    new AddBFSButtonEventListener(this.graph.id, button_factory);
  }

  install = () => {
    FigureRegistry.register({
      actions_id: this.container.id + "_play_bfs",
      name: "Algorithme BFS",
      id: this.graph.id + "_play_bfs",
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
