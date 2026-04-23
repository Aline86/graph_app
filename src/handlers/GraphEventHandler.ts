import type CustomEvents from "../events/CustomEvents";
import type GraphViewModel from "../viewmodel/GraphViewModel";

export default class GraphEventHandler {
  private graph_vm: GraphViewModel;
  private bus: CustomEvents;

  constructor(graph_vm: GraphViewModel, bus: CustomEvents) {
    this.graph_vm = graph_vm;

    this.bus = bus;

    this.on_node_position_update();
  }

  private on_node_position_update(): void {
    this.bus.addEventListener("node:position:update", (e: Event) => {
      const { node } = (e as CustomEvent).detail;
      this.graph_vm.add_recalculate_arrow_on_node_move(node.id);
    });
  }

  remove_node = (node_id?: string): void => {
    if (!node_id) return;
    this.graph_vm.remove_node(node_id);
  };
}
