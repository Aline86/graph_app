import MenuDomBuilder from "../builders/dom/MenuDomBuilder";
import type CustomEvents from "../events/CustomEvents";
import type Module from "../interface/Module";
import type Graph from "../model/Graph";
import FigureRegistry from "../registry/FigureRegistry";
import NodeView from "../view/NodeView";
import NodeViewModel from "../viewmodel/NodeViewModel";

export default class NodeModule implements Module {
  graph: Graph;
  constructor(graph: Graph) {
    this.graph = graph;
  }
  static register() {
    FigureRegistry.register({
      actions_id: NodeView.node_id,
      name: "renommer le noeud",
      action: "click",
      id: "button_rename_node",
      handler: () => {},
    });
    FigureRegistry.register({
      actions_id: NodeView.node_id,
      name: "Bouger le noeud",
      action: "click",
      id: "update_position",
      handler: () => {},
    });
    FigureRegistry.register({
      actions_id: NodeView.node_id,
      id: "add_node",
      name: "Ajouter un noeud",
      action: "click",

      handler: () => {},
    });
  }

  install(bus: CustomEvents, container: HTMLElement) {
    const node_vm = new NodeViewModel(this.graph, bus);
    new MenuDomBuilder(container, bus);
    const node_view = new NodeView(container, node_vm, bus);

    FigureRegistry.update_handler(
      "button_rename_node",
      node_view.handler.rename_listener.action,
    );
    FigureRegistry.update_handler(
      "add_node",
      node_view.handler.move_listener.action,
    );
    FigureRegistry.update_handler("add_node", node_view.node_db.add_node);
    node_view.node_db.add_node_button();
  }
}
