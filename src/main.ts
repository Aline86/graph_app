import "./style.css";
import App from "./App.ts";
import Graph from "./model/Graph.ts";
import AlgorithmEvents from "./events/AgorithmEvents.ts";
import Storage from "./modules/Storage.ts";

if (Object.keys(localStorage).length > 0) {
  for (const key of Object.keys(localStorage)) {
    const _graph = localStorage.getItem(key);
    if (!_graph) continue;

    const bus = new AlgorithmEvents();
    const graph = new Graph(50, 0);
    graph.init(JSON.parse(_graph));
    const storage_module = new Storage(graph, bus);

    new App(graph, "#app", bus, storage_module);
  }
} else {
  localStorage.clear();
  const bus = new AlgorithmEvents();
  const graph = new Graph(50, 0);
  const storage_module = new Storage(graph, bus);

  new App(graph, "#app", bus, storage_module);
}
