import "./style.css";
import App from "./App.ts";
import Graph from "./model/Graph.ts";
import AlgorithmEvents from "./events/AgorithmEvents.ts";

const graph = new Graph(50, 0);
graph.create_nodes();
const bus = new AlgorithmEvents();
new App(graph, "#app", bus);
