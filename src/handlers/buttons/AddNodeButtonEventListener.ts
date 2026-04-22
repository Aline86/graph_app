import type MenuDomBuilder from "../../builders/dom/MenuDomBuilder";

import CustomEvents from "../../events/CustomEvents";
import type EventHandler from "../../interface/EventHandler";
import type Node from "../../model/Node";

import FigureRegistry from "../../registry/FigureRegistry";

import type NodeViewModel from "../../viewmodel/NodeViewModel";

export default class AddNodeButtonEventListener {
  node_vm: NodeViewModel;
  menu_db: MenuDomBuilder;
  bus: CustomEvents;

  container: HTMLElement;
  constructor(
    node_vm: NodeViewModel,
    menu_db: MenuDomBuilder,
    bus: CustomEvents,
    container: HTMLElement,
  ) {
    this.node_vm = node_vm;
    this.menu_db = menu_db;
    this.bus = bus;

    this.container = container;
  }

  remove_action = () => {};

  action = (element: HTMLElement) => {
    this.container.appendChild(element);
    const handler = FigureRegistry.get_action_by_id("add_node");

    if (handler) {
      const button = document.getElementById(element.id);
      if (!button) return;
      button.addEventListener("click", () => handler.handler(element));
    }
  };
}
