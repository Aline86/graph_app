import type CustomEvents from "../events/CustomEvents";
import type Module from "../interface/Module";
import type Graph from "../model/Graph";
import FigureRegistry from "../registry/FigureRegistry";
import ArrowView from "../view/ArrowView";
import ArrowViewModel from "../viewmodel/ArrowViewModel";

export default class ArrowModule implements Module {
  graph: Graph;
  constructor(graph: Graph) {
    this.graph = graph;
  }

  install(bus: CustomEvents, container: HTMLElement) {
    const arrow_vm = new ArrowViewModel(this.graph, bus);
    const arrow_view = new ArrowView(container, arrow_vm, bus);

    FigureRegistry.register({
      actions_id: this.graph.id + "_palette",
      id: this.graph.id + "_" + "button_draw_arrow",
      class_name: "button_draw_arrow",
      name: "dessiner les flèches",
      action: "click",

      handler: arrow_view.arrow_handler.detect_click,
      mode: "none",
    });
  }
}
