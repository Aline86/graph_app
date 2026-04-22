import type Arrow from "../model/Arrow";
import type Button from "../model/Button";
import type Node from "../model/Node";

export default class CustomEvents extends EventTarget {
  constructor() {
    super();
  }
  deactivate_all_actions() {
    let event = new CustomEvent("deactivate:actions", {});

    this.dispatchEvent(event);
  }
  update_coordinates(node: Node) {
    let event = new CustomEvent("node:position:update", {
      detail: {
        node: node,
      },
    });

    this.dispatchEvent(event);
  }

  trigger_remove_arrow(arrow: Arrow) {
    let event = new CustomEvent("remove:arrow", {
      detail: {
        arrow: arrow,
      },
    });
    this.dispatchEvent(event);
  }
  trigger_arrow_drawing_start() {
    this.dispatchEvent(new CustomEvent("arrow:drawing:start"));
  }

  trigger_arrow_drawing_end() {
    this.dispatchEvent(new CustomEvent("arrow:drawing:end"));
  }
  load_arrow(arrow: Arrow) {
    let event = new CustomEvent("load:arrow", {
      detail: {
        arrow: arrow,
      },
    });
    this.dispatchEvent(event);
  }
  trigger_draw_arrow(arrow: Arrow) {
    let event = new CustomEvent("draw:arrow", {
      detail: {
        arrow: arrow,
      },
    });
    this.dispatchEvent(event);
  }
  add_node() {
    let event = new CustomEvent("add:node", {});
    this.dispatchEvent(event);
  }
  trigger_rename_node(node: Node) {
    let event = new CustomEvent("rename:node", {
      detail: {
        node: node,
      },
    });
    this.dispatchEvent(event);
  }
  remove_node_from_dom(node: Node) {
    let event = new CustomEvent("remove:node", {
      detail: {
        node: node,
      },
    });
    this.dispatchEvent(event);
  }
  load_node(node: Node) {
    let event = new CustomEvent("load:node", {
      detail: {
        node: node,
      },
    });
    this.dispatchEvent(event);
  }
  remove_rename_node() {
    let event = new CustomEvent("remove:rename:node", {});
    this.dispatchEvent(event);
  }

  notify_button_state_change(button: Button) {
    let event = new CustomEvent("button:color:change", {
      detail: {
        button: button,
      },
    });
    this.dispatchEvent(event);
  }

  activate_buttons() {
    let event = new CustomEvent("activate:buttons", {});
    this.dispatchEvent(event);
  }
}
