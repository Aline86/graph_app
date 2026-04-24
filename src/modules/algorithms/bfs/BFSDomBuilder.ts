import type DomBuilder from "../../../builders/dom/DomBuilder";
import type AlgorithmEvents from "../../../events/AgorithmEvents";
import Button from "../../../model/Button";
import type Node from "../../../model/Node";
import FigureRegistry, {
  type FigureAction,
} from "../../../registry/FigureRegistry";
import type ButtonViewModel from "../../../viewmodel/ButtonViewModel";

export default class BFSDomBuilder implements DomBuilder<Button> {
  button_vm: ButtonViewModel;
  container: HTMLElement;
  bus: AlgorithmEvents;
  nodes: Node[];
  button: Button | null;
  figure_action: FigureAction | undefined;
  constructor(
    button_vm: ButtonViewModel,
    container: HTMLElement,
    bus: AlgorithmEvents,
  ) {
    this.bus = bus;
    this.button_vm = button_vm;
    this.button = null;
    this.container = container;
    this.trigger_wait();
    this.highlight_node();
    this.remove_highlight_node();
    this.nodes = [];
    this.figure_action = FigureRegistry.get_action_by_id(
      this.container.id + "_play_bfs",
    );
    this.deactivate_all_actions();
  }

  update = () => {};
  delete = () => {
    if (!this.button) return;

    const button = document.getElementById(this.button.id);
    if (!button) return;
    this.container.appendChild(button);

    if (!button) return;
    button.removeEventListener("click", () => {
      if (this.figure_action && this.figure_action !== undefined) {
        this.figure_action.handler();
      }
    });
  };
  add = (action?: string): void => {
    if (!action) return;

    const method = FigureRegistry.get_action_by_id(action);

    if (method) {
      return method.handler();
    }
  };
  deactivate_all_actions = () => {
    this.bus.addEventListener("deactivate:actions", () => {
      this.bus.trigger_reinit_graph();
      this.delete();
    });
  };
  action = (element?: Button) => {
    if (!element) return;
    this.button = element;
    const button = document.getElementById(this.button.id);
    if (!button) return;
    this.container.appendChild(button);

    if (!button) return;
    button.addEventListener("click", () => {
      if (this.figure_action && this.figure_action !== undefined) {
        this.figure_action.handler();
      }
    });
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
