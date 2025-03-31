import { Collider } from "./Collider";
import RectCollider from "./RectCollider";

export class CollisionManager{

    //static instance : null;
    private colliders : Collider[] = [];
    constructor(){
        this.colliders = [];
  //      CollisionManager.instance = this;
    }

    addCollider(collider: Collider): void{
        this.colliders.push(collider);
    }
    removeCollider(collider: Collider) {
        const index = this.colliders.indexOf(collider);
        if (index > -1) this.colliders.splice(index, 1);
    }

     checkCollisions(): void {
        // for (let collider of this.colliders) {
        //     console.log(collider);
            
        //     collider.resetCollision(); // Reset trước khi kiểm tra
        // }

        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i + 1; j < this.colliders.length; j++) {
                const objA = this.colliders[i];
                const objB = this.colliders[j];

                if (objA instanceof RectCollider && objB instanceof RectCollider) {
                    if (objA.checkCollision(objB)) {
                        objA.onCollision(objB);
                        objB.onCollision(objA);
                    }
                }
            }
        }
    }

}