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

  install(bus: CustomEvents, container: HTMLElement) {
    const node_vm = new NodeViewModel(this.graph, bus);
    new MenuDomBuilder(container, bus);
    const node_view = new NodeView(container, node_vm, bus);
    FigureRegistry.register({
      actions_id: "menu_node",
      name: "renommer le noeud",
      action: "click",
      id: "button_rename_node",
      handler: node_view.handler.rename_listener.action,
    });
    FigureRegistry.register({
      actions_id: NodeView.node_id,
      name: "Bouger le noeud",
      action: "click",
      id: "update_position",
      handler: node_view.node_db.add_node_button,
    });
    FigureRegistry.register({
      actions_id: NodeView.node_id,
      id: "add_node",
      name: "Ajouter un noeud",
      action: "click",

      handler: node_view.node_db.add_node,
    });
    node_view.node_db.add_node_button();
  }
}
