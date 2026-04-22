import type AlgorithmEvents from "../../../events/AgorithmEvents";
import type Graph from "../../../model/Graph";
import DomUtils from "../../../utils/DomUtils";
import BFSViewModel from "./BFSViewModel";

export default class BFSLogic extends DomUtils {
  bus: AlgorithmEvents;
  bfs_vm: BFSViewModel;
  graph: Graph;
  trigger: boolean = false;
  constructor(graph: Graph, bus: AlgorithmEvents) {
    super();
    this.bus = bus;
    this.graph = graph;
    this.bfs_vm = new BFSViewModel(graph, bus);
  }

  async trigger_bfs() {
    this.trigger = !this.trigger;
    if (this.trigger) {
      const map = this.graph.create_hash_map();
      const start = this.graph.get_most_connected_node();
      if (!start) return;
      await this.bfs(map, start);
    } else {
      this.bfs_vm.trigger_reinit_graph();
    }
  }
  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async bfs(hashmap: Map<string, string[]>, start: string): Promise<void> {
    const visited: string[] = [];

    const queue = [start];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.includes(current)) continue;

      this.bfs_vm.trigger_highlight_node(current);
      visited.push(current);
      queue.push(...(hashmap.get(current) ?? []));

      await this.sleep(500);
    }
  }
}
