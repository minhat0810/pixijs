export class Collider {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public onCollide: (other: Collider) => void;
    public isColliding: boolean;

    constructor(x: number, y: number, width: number, height: number, onCollide: (other: Collider) => void) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.onCollide = onCollide;
        this.isColliding = false;
    }

    checkCollision(other: Collider): boolean {
        throw new Error("checkCollision() must be implemented in a subclass");
        console.log(other);
        
    }

    onCollision(other: Collider) {
        if (!this.isColliding) {
            this.isColliding = true;
            this.onCollide?.(other);
        }
    }

    resetCollision() {
        this.isColliding = false;
    }
}
