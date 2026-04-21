import type CustomEvents from "../../events/CustomEvents";
import DomUtils from "../../utils/DomUtils";

export default class ArrowDomBuilder extends DomUtils {
  container: string;
  bus: CustomEvents;
  constructor(container: string, bus: CustomEvents) {
    super();
    this.container = container;
    this.bus = bus;
    this.on_draw_arrow();
  }

  private on_draw_arrow = () => {
    this.bus.addEventListener("draw:arrow", (e) => {
      const A = (e as CustomEvent).detail;
      if (!A) return;
      const arrow = A.arrow;

      let svg = document.getElementById(
        arrow.id + "-svg",
      ) as SVGSVGElement | null;
      if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = arrow.id + "-svg";
        svg.style.position = "absolute";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none";
        svg.style.overflow = "visible";

        const defs = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "defs",
        );
        const marker = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "marker",
        );
        marker.id = arrow.id + "-arrowhead";
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "10");
        marker.setAttribute("refY", "3.5");
        marker.setAttribute("orient", "auto");

        const polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon",
        );
        polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
        polygon.setAttribute("fill", "black");

        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.appendChild(defs);

        document
          .getElementById(this.container)
          ?.parentElement?.appendChild(svg);
      }

      let line = document.getElementById(
        arrow.id + "-line",
      ) as SVGLineElement | null;
      if (!line) {
        line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.id = arrow.id + "-line";
        line.setAttribute("marker-end", `url(#${arrow.id}-arrowhead)`);
        svg.appendChild(line);
      }

      const startEl = document.getElementById(arrow.start_node.id + "");
      const startRect = startEl!.getBoundingClientRect();
      const x1 = startRect.left + startRect.width / 2 + window.scrollX;
      const y1 = startRect.top + startRect.height / 2 + window.scrollY;

      let x2: number;
      let y2: number;

      if (arrow.end_node) {
        const endEl = document.getElementById(arrow.end_node.id + "");
        const endRect = endEl!.getBoundingClientRect();
        const rawX2 = endRect.left + endRect.width / 2 + window.scrollX;
        const rawY2 = endRect.top + endRect.height / 2 + window.scrollY;

        const dx = rawX2 - x1;
        const dy = rawY2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);

        const radius = endRect.width * 0.5;
        x2 = rawX2 - (dx / length) * radius;
        y2 = rawY2 - (dy / length) * radius;
      } else {
        x2 = arrow.end_tmp.x;
        y2 = arrow.end_tmp.y;
      }

      line.setAttribute("x1", String(x1));
      line.setAttribute("y1", String(y1));
      line.setAttribute("x2", String(x2));
      line.setAttribute("y2", String(y2));
      line.setAttribute("stroke", "black");
      line.setAttribute("stroke-width", "2");
    });
  };
}
