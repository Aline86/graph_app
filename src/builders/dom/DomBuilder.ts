export default interface DomBuilder<T> {
  update: () => void;
  delete: (element?: T) => void;
  add: () => HTMLElement | void;
}
