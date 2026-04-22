import type Arrow from "../model/Arrow";
import type Node from "../model/Node";
import CustomEvents from "./CustomEvents";

export default class AlgorithmEvents extends CustomEvents {
  constructor() {
    super();
  }
  highlight_node(node: Node) {
    let event = new CustomEvent("highlight:node", {
      detail: {
        node: node,
      },
    });

    this.dispatchEvent(event);
  }
  wait() {
    let event = new CustomEvent("wait", {});

    this.dispatchEvent(event);
  }
  highlight_arrow(arrow: Arrow) {
    let event = new CustomEvent("arrow:highlight", {
      detail: {
        arrow: arrow,
      },
    });

    this.dispatchEvent(event);
  }
  trigger_reinit_graph() {
    let event = new CustomEvent("reinit:graph", {});

    this.dispatchEvent(event);
  }
  algorithm_active() {
    let event = new CustomEvent("algorithm:active", {});

    this.dispatchEvent(event);
  }

  algorithm_inactive() {
    let event = new CustomEvent("algorithm:inactive", {});

    this.dispatchEvent(event);
  }
}
