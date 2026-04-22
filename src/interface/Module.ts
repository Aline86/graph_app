import type CustomEvents from "../events/CustomEvents";

export default interface Module {
  install(bus?: CustomEvents, container?: HTMLElement): void;
}
