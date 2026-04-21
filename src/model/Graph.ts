import Arrow from "./Arrow";
import Node from "./Node";

export default class Graph {
  id: string;
  nodes_number: number;
  node_width: number;
  node_type: string;
  nodes: Record<string, Node>;
  arrows: Record<string, Arrow>;

  constructor(node_width: number, nodes_number: number) {
    this.id = crypto.randomUUID();
    this.nodes_number = nodes_number;
    this.node_type = "graph";
    this.node_width = node_width;
    this.nodes = {};
    this.arrows = {};
  }

  create_nodes() {
    for (let index = 0; index < this.nodes_number; index++) {
      const node = new Node(this.node_width);
      this.nodes[node.id] = node;
    }
  }

  create_node = () => {
    const node = new Node(this.node_width);
    this.nodes[node.id] = node;
    return node;
  };

  create_arrow(node: Node) {
    const arrow = new Arrow(node);
    this.add_arrow_to_graph(arrow);
    return arrow;
  }

  add_arrow_to_graph(arrow: Arrow) {
    this.arrows[arrow.id] = arrow;
  }
}
