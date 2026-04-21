import type PaletteDomBuilder from "../builders/dom/PaletteDomBuilder";
import type CustomEvents from "../events/CustomEvents";
import type Node from "../model/Node";

export default class PaletteEventHandler {
  bus: CustomEvents;
  activeNode: string | null = null;

  palette_db: PaletteDomBuilder;

  nodes: Record<string, Node>;
  container: HTMLElement | null;
  constructor(
    palette_db: PaletteDomBuilder,
    container: HTMLElement,
    nodes: Record<string, Node>,
    bus: CustomEvents,
  ) {
    this.container = container;
    this.nodes = nodes;
    this.bus = bus;
    this.palette_db = palette_db;

    this.activate_palette_actions();
  }

  activate_palette_actions = () => {
    this.container?.addEventListener("click", (e: MouseEvent) => {
      const nodeEl = (e.target as HTMLElement).closest(
        ".node",
      ) as HTMLElement | null;
      if (!nodeEl) return;

      const node = this.nodes[nodeEl.id];
      if (!node) return;

      const action = this.palette_db.get_active_action();
      if (!action || !node) return;

      action.handler(node);
    });
  };
}
