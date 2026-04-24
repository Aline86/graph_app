import type CustomEvents from "../events/CustomEvents";
import type Module from "../interface/Module";
import type Graph from "../model/Graph";
import FigureRegistry from "../registry/FigureRegistry";

export default class StorageModule implements Module {
  graph: Graph;
  bus: CustomEvents;
  constructor(graph: Graph, bus: CustomEvents) {
    this.graph = graph;
    this.bus = bus;

    FigureRegistry.register({
      actions_id: this.graph.id + "_palette",
      id: this.graph.id + "_" + "clear",
      class_name: "clear",
      name: "Supprimer le graphe",
      action: "click",

      handler: this.clear,
      mode: "none",
    });
  }

  install() {
    this.bus.addEventListener("add:node", () => this.save());
    this.bus.addEventListener("node:position:update", () => this.save());
    this.bus.addEventListener("rename:node", () => this.save());
    this.bus.addEventListener("remove:node", () => this.save());
    this.bus.addEventListener("draw:arrow", () => this.save());
    this.bus.addEventListener("remove:arrow", () => this.save());
    this.bus.addEventListener("deactivate:app", () => {
      window.location.reload();
    });
  }

  private save() {
    localStorage.setItem(String(this.graph.id), JSON.stringify(this.graph));
  }
  private clear = () => {
    const data = localStorage.removeItem(this.graph.id);
    this.bus.deactivate_app();

    return data;
  };
  load = () => {
    const data = localStorage.getItem(this.graph.id);

    return data ? JSON.parse(data) : null;
  };
}
