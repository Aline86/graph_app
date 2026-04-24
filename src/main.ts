import "./style.css";
import App from "./App.ts";
import Graph from "./model/Graph.ts";
import AlgorithmEvents from "./events/AgorithmEvents.ts";
import StorageModule from "./modules/StorageModule.ts";

if (Object.keys(localStorage).length > 0) {
  for (const key of Object.keys(localStorage)) {
    const _graph = localStorage.getItem(key);
    if (!_graph) continue;

    const bus = new AlgorithmEvents();
    const graph = new Graph(50, 0);
    graph.init(JSON.parse(_graph));
    const storage_module = new StorageModule(graph, bus);

    new App(graph, "#app", bus, storage_module);
  }
} else {
  const bus = new AlgorithmEvents();
  const graph = new Graph(50, 0);
  const storage_module = new StorageModule(graph, bus);

  new App(graph, "#app", bus, storage_module);
}
