import type PaletteDomBuilder from "../builders/dom/PaletteDomBuilder";
import type CustomEvents from "../events/CustomEvents";
import type Node from "../model/Node";
import type ButtonViewModel from "../viewmodel/ButtonViewModel";

export default class PaletteEventHandler {
  bus: CustomEvents;
  activeNode: string | null = null;
  nodes: Record<string, Node>;
  palette_db: PaletteDomBuilder;
  button_vm: ButtonViewModel;
  container: HTMLElement | null;

  constructor(
    palette_db: PaletteDomBuilder,
    button_vm: ButtonViewModel,
    container: HTMLElement,
    nodes: Record<string, Node>,
    bus: CustomEvents,
  ) {
    this.container = container;
    this.nodes = nodes;
    this.bus = bus;
    this.palette_db = palette_db;
    this.button_vm = button_vm;
    this.activate_palette_actions();
  }

  activate_palette_actions = () => {
    this.container?.addEventListener("click", (e: MouseEvent) => {
      const action = this.bus.get_active_action();

      if (!action) return;
      // none action palette hidden by default if no node => none targets all palette actions
      if (action.mode === "none") {
        const nodeEl = (e.target as HTMLElement).closest(
          ".node",
        ) as HTMLElement | null;
        if (!nodeEl) return;

        const node = this.nodes[nodeEl.id];
        if (!node) return;

        action.handler(node);
      }
    });
  };
}
