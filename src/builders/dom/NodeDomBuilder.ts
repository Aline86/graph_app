import type CustomEvents from "../../events/CustomEvents";
import ButtonFactory from "../../factory/ButtonFactory";
import type Node from "../../model/Node";
import type { FigureAction } from "../../registry/FigureRegistry";
import FigureRegistry from "../../registry/FigureRegistry";
import type NodeViewModel from "../../viewmodel/NodeViewModel";
import type DomBuilder from "./DomBuilder";

export default class NodeDomBuilder implements DomBuilder<Node> {
  node_vm: NodeViewModel;
  bus: CustomEvents;
  container: HTMLElement;
  actions: FigureAction<any>[] | undefined;

  constructor(
    node_vm: NodeViewModel,
    container: HTMLElement,
    bus: CustomEvents,
  ) {
    this.node_vm = node_vm;
    this.actions = [];
    const rename_node = FigureRegistry.get_action_by_id("button_rename_node");

    if (rename_node !== undefined) {
      this.actions.push(rename_node);
    }
    const delete_node = FigureRegistry.get_action_by_id("remove_node");

    if (delete_node !== undefined) {
      this.actions.push(delete_node);
    }
    this.bus = bus;
    this.container = container;
  }

  update = () => {};
  delete = () => {};
  add_node = (): void => {
    const node = this.node_vm.create_node();
    const element = this.add(node);

    if (element) {
      this.container?.appendChild(element);
      this.create_node_buttons(node.id);
      this.bus.activate_buttons(); // ← ici c'est correct
    }
  };
  add = (node?: Node): HTMLElement | void => {
    if (!node) return;
    const _node = document.createElement("div");
    _node.id = node.id;
    _node.className = "node";

    const input = document.createElement("input");
    input.type = "text";
    input.id = `${node.id}_input`;
    input.style.width = node.node_width + "px";
    input.style.height = node.node_width + "px";
    input.setAttribute("value", node.name ?? "");

    _node.appendChild(input);

    return _node;
  };
  add_node_button = (): void => {
    if (this.container) {
      ButtonFactory.create_button(
        "Ajouter un noeud",
        "add_node",
        this.add_node.bind(this),
        this.container.id,
        "active",
      );
    }
  };
  create_node_buttons(node_id: string): void {
    if (!this.actions) return;

    for (const action of this.actions) {
      this.create_button_on_node(node_id, action);
    }
  }

  create_button_on_node(node_id: string, actionObj?: FigureAction): void {
    if (!node_id || !actionObj) return;

    let container = document.getElementById(
      "node_container_" + node_id,
    ) as HTMLDivElement | null;

    if (!container) {
      container = document.createElement("div");
      container.id = "node_container_" + node_id;
      container.className = "absolute";

      document.getElementById(node_id)?.appendChild(container);
    }

    const buttonId = `${node_id}_${actionObj.id}`;

    if (document.getElementById(buttonId)) return;

    const button = document.createElement("button");
    button.id = buttonId;
    button.innerHTML = actionObj.name;

    button.addEventListener(actionObj.action, () => {
      actionObj.handler(node_id);
    });

    container.appendChild(button);
  }
}
