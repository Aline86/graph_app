import type CustomEvents from "../events/CustomEvents";
import type Button from "../model/Button";

export default interface Module {
  install(bus: CustomEvents, container: HTMLElement, buttons: Button): void;
}
