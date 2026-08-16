import type CustomEvents from "../../events/CustomEvents";
import type Arrow from "../../model/Arrow";

export default class ArrowDomBuilder {
  container: string;
  bus: CustomEvents;
  constructor(container: string, bus: CustomEvents) {
    this.container = container;
    this.bus = bus;
    this.on_draw_arrow();
    this.on_load_arrow();
  }

  private on_draw_arrow = () => {
    this.bus.addEventListener("draw:arrow", (e) => {
      const A = (e as CustomEvent).detail;

      if (!A) return;
      const arrow = A.arrow;

      this.draw(arrow);
    });
  };

  private draw = (arrow: Arrow) => {
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

      document.getElementById(this.container)?.appendChild(svg);
    }

    let line = document.getElementById(
      arrow.id + "-line",
    ) as SVGLineElement | null;
    if (!line) {
      line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.id = arrow.id + "-line";
      line.setAttribute("marker-end", `url(#${arrow.id}-arrowhead)`);
      svg.appendChild(line);
      svg.style.position = "absolute";
      svg.style.left = "0";
      svg.style.top = "0";
      svg.style.width = "100%";
      svg.style.height = "100%";
    }

    const half_start = arrow.start_node.node_width * 0.5;
    const x1 = arrow.start_node.position.x + half_start;
    const y1 = arrow.start_node.position.y + half_start;

    let x2: number;
    let y2: number;

    if (arrow.end_node) {
      const radius = arrow.end_node.node_width * 0.5;
      const cx = arrow.end_node.position.x + radius;
      const cy = arrow.end_node.position.y + radius;

      const dx = cx - x1;
      const dy = cy - y1;
      const length = Math.hypot(dx, dy);

      if (length === 0) {
        x2 = cx;
        y2 = cy;
      } else {
        x2 = cx - (dx / length) * radius;
        y2 = cy - (dy / length) * radius;
      }
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
  };
  private on_load_arrow = () => {
    this.bus.addEventListener("load:arrow", (e) => {
      const A = (e as CustomEvent).detail;
      if (!A) return;
      const arrow = A.arrow;

      this.draw(arrow);
    });
  };
}
