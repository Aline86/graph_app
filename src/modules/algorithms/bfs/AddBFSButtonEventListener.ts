import FigureRegistry from "../../../registry/FigureRegistry";
import type ButtonFactory from "../../../factory/ButtonFactory";

export default class AddBFSButtonEventListener {
  graph_id: string;
  button_factory: ButtonFactory;
  constructor(container: string, button_factory: ButtonFactory) {
    this.graph_id = container;
    this.button_factory = button_factory;
    this.add_node_button();
  }

  remove_action = () => {};
  add_node_button = (): void => {
    const actions = FigureRegistry.get(this.graph_id + "_play_bfs");

    if (this.graph_id && actions) {
      for (const key in actions) {
        const action = actions[key];
        this.button_factory.create_button(
          action.action,
          action.name,
          action.id,
          action.class_name,
          action.handler,
          this.graph_id,
          action.mode,
        );
      }
    }
  };
}
