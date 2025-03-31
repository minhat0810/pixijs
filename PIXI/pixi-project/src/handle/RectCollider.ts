// import { Collider } from "./Collider";

// export default class RectCollider extends Collider{
//     checkCollision(other: Collider): boolean {
//         if(other instanceof RectCollider){
//             return (
//                     this.x < other.x + other.width &&
//                     this.x + this.width > other.x &&
//                     this.y < other.y + other.height &&
//                     this.y + this.height > other.y 
//             );
//         }
//         return false;
//     }
//     private checkCollisiion(other: RectCollider): boolean {
//         let a = this.object
//     }
// }

import { Collider } from "./Collider";

export default class RectCollider extends Collider {
    checkCollision(other: Collider): boolean {
        if (other instanceof RectCollider) {
            return (
                this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y
            );
        }
        return false;
    }
}
