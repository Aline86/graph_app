import type DomBuilder from "../../../builders/dom/DomBuilder";
import type AlgorithmEvents from "../../../events/AgorithmEvents";
import Button from "../../../model/Button";
import type Node from "../../../model/Node";
import FigureRegistry, {
  type FigureAction,
} from "../../../registry/FigureRegistry";
import ButtonViewModel from "../../../viewmodel/ButtonViewModel";

export default class BFSDomBuilder implements DomBuilder<Button> {
  button_vm: ButtonViewModel;
  container: string;
  bus: AlgorithmEvents;
  nodes: Node[];
  button: Button;
  figure_action: FigureAction | undefined;
  constructor(container: string, bus: AlgorithmEvents, button: Button) {
    this.bus = bus;
    this.button = button;
    this.button_vm = new ButtonViewModel(bus, button);

    this.container = container;
    this.trigger_wait();
    this.highlight_node();
    this.remove_highlight_node();
    this.nodes = [];
    this.figure_action = FigureRegistry.get_action_by_id(
      this.container + "_play_bfs",
    );
    this.activate_buttons();
    this.deactivate_all_actions();
  }

  update = () => {};
  delete = () => {
    if (!this.button) return;

    const button = document.getElementById(this.container + "_play_bfs");
    if (!button) return;
    document.getElementById(this.container)?.appendChild(button);

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
    if (!this.button.id) return;
    const button = document.getElementById(this.button?.id);
    if (!button) return;
    document.getElementById(this.container)?.appendChild(button);

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
  activate_buttons = () => {
    this.bus.addEventListener("activate:buttons", () => {
      const actions = FigureRegistry.get(this.container + "_play_bfs");

      if (actions)
        for (const action of actions) {
          this.button_vm.change_button_state(action.id, action.mode);
          this.button_vm.toggle_state_state(action.id);
        }
    });
  };
}
