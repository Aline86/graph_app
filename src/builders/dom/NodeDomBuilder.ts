import type CustomEvents from "../../events/CustomEvents";
import ButtonSingleton from "../../singleton/ButtonSingleton";
import type Node from "../../model/Node";
import type { FigureAction } from "../../registry/FigureRegistry";
import FigureRegistry from "../../registry/FigureRegistry";
import DomUtils from "../../utils/DomUtils";
import type NodeViewModel from "../../viewmodel/NodeViewModel";
import type DomBuilder from "./DomBuilder";
import Position from "../../model/Position";

export default class NodeDomBuilder
  extends DomUtils
  implements DomBuilder<Node>
{
  node_vm: NodeViewModel;
  bus: CustomEvents;
  container: HTMLElement;
  actions: FigureAction<any>[] | undefined;
  private node_count = 0;
  constructor(
    node_vm: NodeViewModel,
    container: HTMLElement,
    bus: CustomEvents,
  ) {
    super();
    this.node_vm = node_vm;
    this.actions = [];

    this.bus = bus;
    this.container = container;
    this.on_load_node();
  }
  private on_load_node = () => {
    this.bus.addEventListener("load:node", (e) => {
      const N = (e as CustomEvent).detail;

      if (!N) return;
      const node = N.node;

      this.load(node);
    });
  };
  load = (node?: Node) => {
    let element = null;
    if (node) element = this.add(node);

    if (element && node) {
      this.container?.appendChild(element);
      this.update_position(node);
      this.create_node_buttons(node.id);
      this.bus.activate_buttons();
    }
  };
  delete = () => {};
  update = () => {};

  add_node = (): void => {
    const node = this.node_vm.create_node();
    const element = this.add(node);

    if (element) {
      this.container?.appendChild(element);

      const i = this.node_count++;
      node.set_position(
        new Position(100 + (i % 6) * 90, 100 + Math.floor(i / 6) * 90),
      );
      this.update_position(node);

      this.create_node_buttons(node.id);
      this.bus.activate_buttons();
      this.bus.add_node();
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
      ButtonSingleton.create_button(
        "click",
        "Ajouter un noeud",
        this.container.id + "_add_node",
        "add_node",
        this.add_node.bind(this),
        this.container.id,
        "active",
        false,
      );
    }
  };
  create_node_buttons(node_id: string): void {
    const actions = FigureRegistry.get(this.container.id + "_menu_node");
    if (!actions) return;
    for (const action of actions) {
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
