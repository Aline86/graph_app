import type CustomEvents from "../events/CustomEvents";
import type Module from "../interface/Module";
import type Graph from "../model/Graph";

export default class StorageModule implements Module {
  graph: Graph;
  constructor(graph: Graph) {
    this.graph = graph;
  }

  install(bus: CustomEvents) {
    bus.addEventListener("add:node", () => this.save());
    bus.addEventListener("node:position:update", () => this.save());
    bus.addEventListener("rename:node", () => this.save());
    bus.addEventListener("remove:node", () => this.save());
    bus.addEventListener("draw:arrow", () => this.save());
    bus.addEventListener("remove:arrow", () => this.save());
  }

  private save() {
    localStorage.setItem("graph", JSON.stringify(this.graph));
  }
  static clear(): any | null {
    const data = localStorage.removeItem("graph");
    return data;
  }
  static load(): any | null {
    const data = localStorage.getItem("graph");

    return data ? JSON.parse(data) : null;
  }
}
