import Letter from "./letter";
import LETTERS from "./letters";

export default class BlockGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    generate () {
        this.scene.letters.add(new Letter(this.scene,this.scene.center_width, 128, this.randomLetter()))
        this.scene.time.addEvent({ 
            delay: 3000, 
            callback: () => { 
                this.scene.playAudio("spawn");
                this.scene.letters.add(new Letter(this.scene,this.scene.center_width, 128, this.randomLetter())); 
                this.scene.updateLetterCount();
                this.scene.checkGameOver();
            }, 
            callbackScope: this, 
            loop: true 
        });
    }

    generateSplash() {
        new Letter(this.scene,this.scene.center_width, this.scene.height - 48, this.randomLetter(), true).setAlpha(0.5)
        this.scene.time.addEvent({ 
            delay: 400, 
            callback: () => { new Letter(this.scene,this.scene.center_width, this.scene.height - 48, this.randomLetter(), true).setAlpha(0.5) }, 
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