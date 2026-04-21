import Position from "./Position";
import Node from "./Node";
export default class Arrow {
  id: string;
  start_node: Node;
  end_node: Node | null;
  end_tmp: Position;
  arrow_length: number;
  direction: number;
  lengthX: number;
  lengthY: number;

  constructor(start_node: Node) {
    this.id = crypto.randomUUID();
    this.end_node = null;
    this.start_node = start_node;
    this.end_tmp = new Position(0, 0);
    this.arrow_length = 0;
    this.direction = 0;
    this.lengthX = 0;
    this.lengthY = 0;
  }
  set_end_node(target: Node) {
    this.end_node = target;
  }
  calculate_length() {
    if (this.start_node !== null && this.end_node !== null) {
      this.lengthX = this.end_node.position.x - this.start_node.position.x;
      this.lengthY = this.end_node.position.y - this.start_node.position.y;
      this.arrow_length = Math.sqrt(
        this.lengthX * this.lengthX + this.lengthY * this.lengthY,
      );

      this.calculate_angle();
    }
  }
  calculate_tmp_length(event: MouseEvent) {
    this.lengthX = event.pageX - this.start_node.position.x;
    this.lengthY = event.pageY - this.start_node.position.y;
    this.end_tmp.x = event.pageX;
    this.end_tmp.y = event.pageY;
  }

  calculate_tmp_angle(event: MouseEvent) {
    const radiant = Math.atan2(
      event.pageY - this.start_node.position.y,
      event.pageX - this.start_node.position.x,
    );

    this.direction = (radiant * 180) / Math.PI;
  }
  calculate_angle() {
    if (this.end_node) {
      const radiant = Math.atan2(
        this.end_node.position.y - this.start_node.position.y,
        this.end_node.position.x - this.start_node.position.x,
      );
      this.direction = (radiant * 180) / Math.PI;
    } else {
      const radiant = Math.atan2(
        this.end_tmp.y - this.start_node.position.y,
        this.end_tmp.x - this.start_node.position.x,
      );
      this.direction = (radiant * 180) / Math.PI;
    }
  }

  draw_line(e: MouseEvent) {
    this.calculate_tmp_length(e);
  }
}
