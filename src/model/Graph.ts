import Arrow from "./Arrow";
import Node from "./Node";
import Position from "./Position";

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

  init(graph: Graph) {
    this.id = graph.id;
    this.nodes_number = graph.nodes_number;
    this.node_type = "graph";
    this.node_width = graph.node_width;

    this.load_nodes(graph.nodes);
    this.load_arrows(graph.arrows);
  }

  get_most_connected_node(): string | null {
    const map: Record<string, number> = {};

    for (const key in this.nodes) {
      if (!Object.hasOwn(this.nodes, key)) continue;
      map[key] = 0;
    }

    for (const key in this.arrows) {
      if (!Object.hasOwn(this.arrows, key)) continue;
      const arrow = this.arrows[key];
      if (!arrow.end_node) continue;
      map[arrow.start_node.id] += 1;
    }

    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  }

  create_hash_map = (): Map<string, string[]> => {
    const map = new Map<string, string[]>();

    for (const key in this.nodes) {
      if (!Object.hasOwn(this.nodes, key)) continue;
      map.set(key, []);
    }

    for (const key in this.arrows) {
      if (!Object.hasOwn(this.arrows, key)) continue;
      const arrow = this.arrows[key];
      if (!arrow.end_node) continue;

      map.get(arrow.start_node.id)?.push(arrow.end_node.id);
    }

    return map;
  };

  create_nodes() {
    for (let index = 0; index < this.nodes_number; index++) {
      const node = new Node(this.node_width);
      this.nodes[node.id] = node;
    }
  }
  load_nodes = (nodes: Record<string, Node>) => {
    for (const key in nodes) {
      if (!Object.hasOwn(nodes, key)) continue;

      const node = nodes[key];
      this.create_loaded_node(node);
    }
  };

  load_arrows = (arrows: Record<string, Arrow>) => {
    for (const key in arrows) {
      if (!Object.hasOwn(arrows, key)) continue;

      const arrow = arrows[key];
      this.create_loaded_arrow(arrow);
    }
  };
  create_node = () => {
    const node = new Node(this.node_width);
    this.nodes[node.id] = node;
    return node;
  };

  create_loaded_node = (node: Node) => {
    const _node = new Node(node.node_width);
    _node.id = node.id;
    _node.name = node.name;
    _node.set_position(node.position);
    this.nodes[_node.id] = _node;
    return _node;
  };
  create_loaded_arrow = (arrow: Arrow) => {
    const start = this.nodes[arrow.start_node.id];
    if (!start) return null;

    const _arrow = new Arrow(start);
    _arrow.id = arrow.id;

    if (arrow.end_node) {
      const end = this.nodes[arrow.end_node.id];
      if (end) _arrow.end_node = end;
    }

    this.add_arrow_to_graph(_arrow);
    return _arrow;
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
