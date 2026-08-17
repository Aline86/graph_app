import ButtonDomBuilder from "./builders/dom/ButtonDomBuilder";
import PaletteDomBuilder from "./builders/dom/PaletteDomBuilder";
import type AlgorithmEvents from "./events/AgorithmEvents";
import PaletteEventHandler from "./handlers/PaletteEventHandler";
import Button from "./model/Button";

import type Graph from "./model/Graph";
import AlgorithmModule from "./modules/algorithms/AlgorithmModule";
import GraphModule from "./modules/GraphModule";
import type Storage from "./modules/Storage";
import NodeMenuView from "./view/NodeMenuView";
import ButtonViewModel from "./viewmodel/ButtonViewModel";

export default class App {
  container: HTMLElement;
  graph: Graph;
  button: Button;
  button_vm: ButtonViewModel;

  constructor(
    graph: Graph,
    container_name: string,
    bus: AlgorithmEvents,
    storage: Storage,
  ) {
    this.graph = graph;
    this.container = this.create_container(container_name);
    this.button = new Button();

    this.load_modules(bus);
    // call after modules so all button functionnalities are registered in core module
    storage.install();
    this.button_vm = new ButtonViewModel(bus, this.button);
    this.load_palette_and_node_menu(bus);
  }

  private load_modules(bus: AlgorithmEvents) {
    const graph_module = new GraphModule(this.graph);
    graph_module.install(bus, this.container, this.button);

    const algorithm_module = new AlgorithmModule(this.graph);
    algorithm_module.install(bus, this.container, this.button);
  }

  private load_palette_and_node_menu(bus: AlgorithmEvents) {
    new ButtonDomBuilder(bus);
    new NodeMenuView(this.graph, bus);

    const palette_db = new PaletteDomBuilder(
      this.container,
      bus,
      this.graph,
      this.button,
      this.button_vm,
    );
    new PaletteEventHandler(palette_db, this.container, this.graph.nodes, bus);
  }

  private create_container(id: string): HTMLElement {
    const container = document.createElement("div");
    container.id = this.graph.id;
    container.className = "graph";
    document.querySelector(id)?.appendChild(container);
    const button_container = document.createElement("div");
    button_container.className = "_palette_container";
    button_container.id = this.graph.id + "_palette_container";
    container.append(button_container);

    return container;
  }
}
