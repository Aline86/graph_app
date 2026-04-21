import type Arrow from "../model/Arrow";
import type Node from "../model/Node";

export default class DomUtils {
  get_target_position = (target: string) => {
    const el = document.getElementById(target);
    if (el) {
      const rect = el.getBoundingClientRect();

      return {
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY,
      };
    }
  };

  remove_node_from_dom = (target?: Node) => {
    console.log("target", target);
    if (!target) return;
    const el = document.getElementById(target.id);

    if (el) {
      el.remove();
    }
  };
  remove_arrow_from_dom = (arrow: Arrow) => {
    const el = document.getElementById(String(arrow.id) + "-svg");

    if (el) {
      el.remove();
    }
  };

  get_HTML_nodes(container_id: string) {
    const nodes = document
      .getElementById(container_id)
      ?.querySelectorAll(".node");

    let html_nodes: Record<string, Element> = {};
    if (nodes !== undefined) {
      for (const node of nodes) {
        if (node.id !== undefined) {
          html_nodes[node.id] = node;
        }
      }
    }
    return html_nodes;
  }

  create_svg() {
    const svg = document.createElementNS("http://www.w3.org/1999/xhtml", "svg");
    svg.id = "svg-layer";

    return svg;
  }
}
