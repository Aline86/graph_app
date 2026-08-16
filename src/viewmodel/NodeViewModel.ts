import CustomEvents from "../events/CustomEvents";
import type Graph from "../model/Graph";
import Node from "../model/Node";
import Position from "../model/Position";
export default class NodeViewModel {
  graph: Graph;
  public bus: CustomEvents;
  constructor(graph: Graph, bus: CustomEvents) {
    this.bus = bus;
    this.graph = graph;
  }
  node_add_position = (node: Node) => {
    const i = Object.keys(this.graph.nodes).length - 1;

    node.set_position(
      new Position(100 + (i % 6) * 90, 100 + Math.floor(i / 6) * 90),
    );
  };
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
