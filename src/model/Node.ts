import Position from "./Position";
type PositionInit = {
  x: number;
  y: number;
};
export default class Node {
  position: Position;
  node_width: number;
  id: string;
  name: string;
  color: string;

  constructor(node_width: number) {
    this.id = crypto.randomUUID();
    this.node_width = node_width;
    this.position = new Position(0, 0);
    this.name = "";
    this.color = "black";
  }

  change_name = (e: Event) => {
    const target = e.target as HTMLInputElement | null;
    if (!target) return;

    this.name = target.value;
  };

  change_color = (color: string) => {
    this.color = color;
  };

  move_node = (e: MouseEvent) => {
    if (0 >= e.clientY) {
      this.position.y = 0;
    } else {
      this.position.y = e.clientY - this.get_center();
    }
    if (0 >= e.clientX) {
      this.position.x = 0;
    } else {
      this.position.x = e.clientX - this.get_center();
    }
  };

  set_position(e: PositionInit) {
    this.position.x = e.x;
    this.position.y = e.y;
  }
  get_center() {
    return this.node_width * 0.5;
  }
}
