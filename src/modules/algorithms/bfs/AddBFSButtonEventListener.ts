import ButtonFactory from "../../../factory/ButtonFactory";
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
    const action = FigureRegistry.get_action_by_id("play_bfs");
    if (this.container && action) {
      ButtonFactory.create_button(
        "click",
        "algorithme BFS",
        "play_bfs",
        action.handler.bind(this),
        this.container.id,
        "active",
      );
    }
  };
}
