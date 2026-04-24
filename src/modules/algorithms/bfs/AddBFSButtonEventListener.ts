import ButtonSingleton from "../../../factory/ButtonSingleton";
import FigureRegistry from "../../../registry/FigureRegistry";

import type BFSDomBuilder from "./BFSDomBuilder";

export default class AddBFSButtonEventListener {
  container: HTMLElement;
  bfs_db: BFSDomBuilder;
  constructor(container: HTMLElement, bfs_db: BFSDomBuilder) {
    this.container = container;
    this.bfs_db = bfs_db;
    this.add_node_button();
  }

  remove_action = () => {};
  add_node_button = (): void => {
    const actions = FigureRegistry.get(this.container.id + "_play_bfs");

    if (this.container && actions) {
      for (const key in actions) {
        const action = actions[key];
        ButtonSingleton.create_button(
          action.action,
          action.name,
          action.id,
          action.class_name,
          action.handler,
          this.container.id,
          action.mode,
        );
      }
    }
  };
}
