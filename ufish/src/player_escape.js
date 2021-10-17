import PlayerUnderwater from "./player_underwater";
import Coin from "./objects/coin";
const VELOCITY = 150;

export default class PlayerEscape extends PlayerUnderwater {
    constructor (scene, x, y, name) {
        super(scene, x, y, "ufo", 0, 0);
    }

    shoot () {
        console.log("SHOOOOT")
        const direction = this.body.velocity.y > 0 ? 1 : -1;
        this.scene.shootingGroup.add(new Coin(this.scene, this.x, this.y + (direction * 69), "coin", 400, direction, true))
        this.coins.pop();
        this.scene.updateCoinScore(-1);
      }  
}