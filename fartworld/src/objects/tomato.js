import Foe from './foe';

export default class Tomato extends Foe {
    constructor ({ scene, x, y, name }) {
        super({scene, x, y, name: "tomato"});
    }

    hitGround(ground, foe) {
        this.scene.playAudio("fall");
        console.log("Oh I hit the ground a tomato!! ", this);
        this.dead = true;
        this.body.enable = false; 
        this.scene.updateScore(1000);
        this.animate("death")
    }
}
