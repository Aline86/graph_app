export type FigureAction<T = any> = {
  actions_id: string;
  id: string;
  name: string;
  action: string;
  handler: (element?: T) => void;
};

export default class FigureRegistry {
  private static actions: Map<string, FigureAction[]> = new Map();

  static register(action: FigureAction): void {
    const existing = FigureRegistry.actions.get(action.actions_id);

    if (existing) {
      existing.push(action);
    } else {
      FigureRegistry.actions.set(action.actions_id, [action]);
    }
  }
  static update_handler(id: string, handler: () => void) {
    const figure = FigureRegistry.get_action_by_id(id);
    if (figure) {
      figure.handler = handler;
    }
  }
  static get(id: string): FigureAction[] | undefined {
    return FigureRegistry.actions.get(id);
  }
  static getAll(): FigureAction[] {
    return Array.from(FigureRegistry.actions.values()).flat();
  }
  static get_action_by_id(id: string): FigureAction | undefined {
    for (const action of FigureRegistry.getAll()) {
      if (action.id === id) {
        return action;
      }
    }

    return undefined;
  }

  static clear(): void {
    FigureRegistry.actions.clear();
  }
}
