import type DomBuilder from "../../../builders/dom/DomBuilder";
import type CustomEvents from "../../../events/CustomEvents";
import Button from "../../../model/Button";
import type Node from "../../../model/Node";
import FigureRegistry, {
  type FigureAction,
} from "../../../registry/FigureRegistry";
import type ButtonViewModel from "../../../viewmodel/ButtonViewModel";

export default class BFSDomBuilder implements DomBuilder<Button> {
  button_vm: ButtonViewModel;
  container: HTMLElement;
  bus: CustomEvents;
  nodes: Node[];
  actions: FigureAction[];
  constructor(
    button_vm: ButtonViewModel,
    container: HTMLElement,
    bus: CustomEvents,
  ) {
    this.bus = bus;
    this.button_vm = button_vm;
    this.actions = FigureRegistry.getAll();
    this.container = container;
    this.trigger_wait();
    this.highlight_node();
    this.remove_highlight_node();
    this.nodes = [];
  }

  update = () => {};
  delete = () => {};
  add = (action?: string): void => {
    if (!action) return;

    const method = FigureRegistry.get_action_by_id(action);

    if (method) {
      return method.handler();
    }
  };

  action = (element?: Button) => {
    if (!element) return;
    const button = document.getElementById(element.id);
    if (!button) return;
    this.container.appendChild(button);
    const handler = FigureRegistry.get_action_by_id("play_bfs");

    if (handler) {
      const button = document.getElementById(element.id);
      if (!button) return;
      button.addEventListener("click", () => handler.handler(element));
    }
  };

  highlight_node = () => {
    this.bus.addEventListener("highlight:node", (e) => {
      const node = (e as CustomEvent).detail;
      const N = node.node;
      this.nodes.push(N);
      this.highlight(N);
    });
  };
  de_highlight = (node: Node) => {
    const _node = document.getElementById(node.id);
    _node?.classList.remove("visited");
  };
  remove_highlight_node = () => {
    this.bus.addEventListener("reinit:graph", () => {
      for (const node of this.nodes) {
        this.de_highlight(node);
      }
    });
  };
  trigger_wait = () => {
    this.bus.addEventListener("wait", async () => {
      await this.sleep(2000);
    });
  };
  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  highlight = (node: Node) => {
    const _node = document.getElementById(node.id);
    _node?.classList.add("visited");
  };
}
