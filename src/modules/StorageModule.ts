import type App from "../App";
import type AlgorithmEvents from "../events/AgorithmEvents";
import type Module from "../interface/Module";
import FigureRegistry from "../registry/FigureRegistry";

export default class StorageModule implements Module {
  app: App;
  bus: AlgorithmEvents;
  constructor(app: App, bus: AlgorithmEvents) {
    this.app = app;
    this.bus = bus;

    FigureRegistry.register({
      actions_id: "palette",
      id: this.app.graph.id + "_" + "clear",
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
    localStorage.setItem("graph", JSON.stringify(this.app.graph));
  }
  private clear = () => {
    const data = localStorage.removeItem("graph");
    this.bus.deactivate_app();

    return data;
  };
  static load(): any | null {
    const data = localStorage.getItem("graph");

    return data ? JSON.parse(data) : null;
  }
}
