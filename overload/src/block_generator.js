import Letter from "./letter";
import LETTERS from "./letters";

export default class BlockGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    generate () {
        this.scene.letters.add(new Letter(this.scene,this.scene.center_width, 128, this.randomLetter()))
        this.scene.time.addEvent({ 
            delay: 4000, 
            callback: () => { this.scene.letters.add(new Letter(this.scene,this.scene.center_width, 128, this.randomLetter())) }, 
            callbackScope: this, 
            loop: true 
        });
    }

    randomLetter () {
        const letters = LETTERS["en"];
        return letters[Phaser.Math.Between(0, letters.length - 1)];
    }

    update () {}
}