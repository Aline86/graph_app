import ButtonDomBuilder from "./builders/dom/ButtonDomBuilder";
import PaletteDomBuilder from "./builders/dom/PaletteDomBuilder";
import type AlgorithmEvents from "./events/AgorithmEvents";
import ButtonSingleton from "./factory/ButtonSingleton";
import PaletteEventHandler from "./handlers/PaletteEventHandler";
import type Graph from "./model/Graph";
import AlgorithmModule from "./modules/algorithms/AlgorithmModule";
import GraphModule from "./modules/GraphModule";
import type StorageModule from "./modules/StorageModule";
import NodeMenuView from "./view/NodeMenuView";
import ButtonViewModel from "./viewmodel/ButtonViewModel";

export default class App {
  container: HTMLElement;
  graph: Graph;
  button_vm: ButtonViewModel;

  constructor(
    graph: Graph,
    container_name: string,
    bus: AlgorithmEvents,
    storage: StorageModule,
  ) {
    this.graph = graph;
    this.container = this.create_container(container_name);
    this.button_vm = new ButtonViewModel(this.graph, bus);

    ButtonSingleton.init(this.button_vm, bus);
    //StorageModule.clear();
    this.load_modules(bus);
    // call after modules so all button functionnalities are registered in core module
    this.load_palette_and_node_menu(bus);
    storage.install();
  }

  private load_modules(bus: AlgorithmEvents) {
    const graph_module = new GraphModule(this.graph);
    graph_module.install(bus, this.container);

    const algorithm_module = new AlgorithmModule(this.graph);
    algorithm_module.install(bus, this.container);
  }

  private load_palette_and_node_menu(bus: AlgorithmEvents) {
    new ButtonDomBuilder(this.button_vm, bus);
    new NodeMenuView(this.graph, bus);

    const palette_db = new PaletteDomBuilder(this.container, bus, this.graph);
    new PaletteEventHandler(
      palette_db,
      this.button_vm,
      this.container,
      this.graph.nodes,
      bus,
    );
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
