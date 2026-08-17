import MenuDomBuilder from "../builders/dom/MenuDomBuilder";
import type CustomEvents from "../events/CustomEvents";
import type Module from "../interface/Module";
import type Button from "../model/Button";
import type Graph from "../model/Graph";
import FigureRegistry from "../registry/FigureRegistry";
import NodeView from "../view/NodeView";
import NodeViewModel from "../viewmodel/NodeViewModel";

export default class NodeModule implements Module {
  graph: Graph;
  constructor(graph: Graph) {
    this.graph = graph;
  }

  install(bus: CustomEvents, container: HTMLElement, buttons: Button) {
    const node_vm = new NodeViewModel(this.graph, bus);
    new MenuDomBuilder(container, bus);
    const node_view = new NodeView(bus, container, node_vm, buttons);
    FigureRegistry.register({
      actions_id: container.id + "_menu_node",
      name: "renommer le noeud",
      class_name: "button_rename_node",
      action: "click",
      id: this.graph.id + "_button_rename_node",
      mode: "active",
      handler: node_view.handler.rename_listener.action,
    });
    FigureRegistry.register({
      actions_id: container.id + "_" + NodeView.node_id,
      name: "Bouger le noeud",
      class_name: "update_position",
      action: "click",
      id: container.id + "_update_position",
      mode: "active",
      handler: node_view.node_db.add_node_button,
    });

    node_view.node_db.add_node_button();
  }
}
