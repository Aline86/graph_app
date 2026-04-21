import ButtonDomBuilder from "./builders/dom/ButtonDomBuilder";
import PaletteDomBuilder from "./builders/dom/PaletteDomBuilder";
import CustomEvents from "./events/CustomEvents";
import ButtonFactory from "./factory/ButtonFactory";
import PaletteEventHandler from "./handlers/PaletteEventHandler";
import type Graph from "./model/Graph";
import ArrowModule from "./modules/ArrowModule";
import GraphModule from "./modules/GraphModule";
import NodeModule from "./modules/NodeModule";
import DomUtils from "./utils/DomUtils";
import NodeMenuView from "./view/NodeMenuView";
import ButtonViewModel from "./viewmodel/ButtonViewModel";

export default class InterfaceView extends DomUtils {
  container: HTMLElement | null = null;
  graph: Graph;
  button_vm: ButtonViewModel;
  node_menu_view: NodeMenuView;
  button_db: ButtonDomBuilder;

  constructor(graph: Graph, container_name: string, bus: CustomEvents) {
    super();
    this.container = document.createElement("div");
    this.container.id = graph.id;
    document.querySelector(container_name)?.appendChild(this.container);
    const button_container = document.createElement("div");
    button_container.id = "button_container";
    this.container.appendChild(button_container);
    document.querySelector(container_name)?.appendChild(this.container);
    this.graph = graph;
    this.container.className = "graph";
    ArrowModule.register();
    NodeModule.register();
    GraphModule.register();
    this.button_vm = new ButtonViewModel(graph, bus);

    ButtonFactory.init(this.button_vm);

    this.button_db = new ButtonDomBuilder(this.button_vm, bus);
    const palette_db = new PaletteDomBuilder(this.container, bus);
    this.node_menu_view = new NodeMenuView(graph, bus);
    new PaletteEventHandler(palette_db, this.container, graph.nodes, bus);
    const graph_module = new GraphModule(graph);
    graph_module.install(bus, this.container);
  }
}
