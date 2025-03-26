export class InputController {
  public keys: { [key: string]: boolean } = {};

  constructor() {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    this.keys[event.key] = true;
  }

  private onKeyUp(event: KeyboardEvent) {
    this.keys[event.key] = false;
  }

  // Phương thức tiện ích để kiểm tra trạng thái key
  public isKeyPressed(key: string): boolean {
    return !!this.keys[key];
  }
}
