import type AlgorithmEvents from "../../../events/AgorithmEvents";
import type Graph from "../../../model/Graph";
import BFSViewModel from "./BFSViewModel";

export default class BFSLogic {
  bus: AlgorithmEvents;
  bfs_vm: BFSViewModel;
  graph: Graph;
  trigger: boolean = false;
  constructor(graph: Graph, bus: AlgorithmEvents) {
    this.bus = bus;
    this.graph = graph;
    this.bfs_vm = new BFSViewModel(graph, bus);
  }

  async trigger_bfs() {
    this.trigger = !this.trigger;

    const map = this.graph.create_hash_map();
    const start = this.graph.get_most_connected_node();
    if (!start) return;
    await this.bfs(map, start);
  }
  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async bfs(hashmap: Map<string, string[]>, start: string): Promise<void> {
    const visited: string[] = [];

    const stack = [start];
    while (stack.length > 0) {
      const current = stack.shift()!;
      if (visited.includes(current)) continue;

      this.bfs_vm.trigger_highlight_node(current);
      visited.push(current);
      stack.push(...(hashmap.get(current) ?? []));

      await this.sleep(500);
    }
  }
}
