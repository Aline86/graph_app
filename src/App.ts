import ButtonDomBuilder from "./builders/dom/ButtonDomBuilder";
import PaletteDomBuilder from "./builders/dom/PaletteDomBuilder";
import type AlgorithmEvents from "./events/AgorithmEvents";
import ButtonFactory from "./factory/ButtonFactory";
import PaletteEventHandler from "./handlers/PaletteEventHandler";
import type Graph from "./model/Graph";
import AlgorithmModule from "./modules/algorithms/AlgorithmModule";
import GraphModule from "./modules/GraphModule";
import StorageModule from "./modules/StorageModule";
import DomUtils from "./utils/DomUtils";
import NodeMenuView from "./view/NodeMenuView";
import ButtonViewModel from "./viewmodel/ButtonViewModel";

export default class App extends DomUtils {
  static activeActionKey: string | null = null;
  container: HTMLElement | null = null;
  graph: Graph;
  button_vm: ButtonViewModel;
  node_menu_view: NodeMenuView;
  button_db: ButtonDomBuilder;

  constructor(graph: Graph, container_name: string, bus: AlgorithmEvents) {
    super();

    this.container = document.createElement("div");
    this.container.id = graph.id;
    document.querySelector(container_name)?.appendChild(this.container);
    const button_container = document.createElement("div");
    button_container.id = "button_container";
    this.container.appendChild(button_container);
    document.querySelector(container_name)?.appendChild(this.container);
    this.graph = graph;

    this.button_vm = new ButtonViewModel(this.graph, bus);
    ButtonFactory.init(this.button_vm, bus);
    //StorageModule.clear();
    this.container.className = "graph";

    const storage_module = new StorageModule(this.graph);

    storage_module.install(bus);

    const graph_module = new GraphModule(this.graph);

    graph_module.install(bus, this.container);

    const algorithm_module = new AlgorithmModule(this.graph);
    algorithm_module.install(bus, this.container);
    this.button_db = new ButtonDomBuilder(this.button_vm, bus);
    this.node_menu_view = new NodeMenuView(this.graph, bus);
    const palette_db = new PaletteDomBuilder(this.container, bus, this.graph);
    new PaletteEventHandler(
      palette_db,
      this.button_vm,
      this.container,
      this.graph.nodes,
      bus,
    );
  }
}
