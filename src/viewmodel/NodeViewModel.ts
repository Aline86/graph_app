import CustomEvents from "../events/CustomEvents";
import type Graph from "../model/Graph";

export default class NodeViewModel {
  graph: Graph;
  public bus: CustomEvents;
  constructor(graph: Graph, bus: CustomEvents) {
    this.bus = bus;
    this.graph = graph;
  }

  create_node = () => {
    const node = this.graph.create_node();
    return node;
  };
  addMoveEventListener = (
    position_x: number,
    position_y: number,
    target: string,
  ): void => {
    const node = this.graph.nodes[target];

    if (node) {
      node.move_node(position_x, position_y);

      this.bus.update_coordinates(node);
    }
  };
  addRenameEventListener = (e: Event, target: string): void => {
    const node = this.graph.nodes[target];
    if (node) node.change_name(e);

    this.bus.trigger_rename_node(node);
  };

  update_node_coordinates(target: string, x: number, y: number) {
    const node = this.graph.nodes[target];
    node.position.x = x;
    node.position.y = y;

    this.bus.update_coordinates(node);
  }
}
