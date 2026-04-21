import "./style.css";
import InterfaceView from "./InterfaceView.ts";
import Graph from "./model/Graph.ts";
import CustomEvents from "./events/CustomEvents.ts";

const graph = new Graph(50, 0);
graph.create_nodes();
const bus = new CustomEvents();
const GraphInterface = new InterfaceView(graph, "#app", bus);
const svg = GraphInterface.create_svg();
document.querySelector<HTMLDivElement>("#app")?.appendChild(svg);
