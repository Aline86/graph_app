import ArrowDomBuilder from "../builders/dom/ArrowDomBuilder";
import type CustomEvents from "../events/CustomEvents";
import ArrowEventHandler from "../handlers/ArrowEventHandler";
import type ArrowViewModel from "../viewmodel/ArrowViewModel";

export default class ArrowView {
  public static actions_id = "arrow_events";
  arrow_db: ArrowDomBuilder;
  arrow_handler: ArrowEventHandler;

  constructor(
    container: HTMLElement,
    arrow_vm: ArrowViewModel,
    bus: CustomEvents,
  ) {
    this.arrow_db = new ArrowDomBuilder(container.id, bus);
    this.arrow_handler = new ArrowEventHandler(arrow_vm, container.id, bus);
  }
}
