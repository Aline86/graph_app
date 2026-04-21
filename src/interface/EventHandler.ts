export default interface EventHandler<T> {
  action: () => void;
  remove_action: (element: T) => void;
  on_bus_events(): void;
}
