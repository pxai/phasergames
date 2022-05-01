import { Fist } from "./weapons";

export default class Player {
    constructor (scene) {
        this.scene = scene;
        this.init();
    }

    init () {
        this.weapons = {
            "fist": new Fist(), 
            "gun": null, "shotgun": null, "minigun": null, 
            "plasma": null, "rocketlauncher": null, "chainsaw": null
        }
        this.currentWeapon = this.weapons["fist"];
        this.health = 100;
        this.shield = 100;
        this.cards = [];
    }

    pickCard () {
        this.currentWeapon.addCard()
    }

    shoot (range) {
        return this.currentWeapon.shoot(range);
    }
}
