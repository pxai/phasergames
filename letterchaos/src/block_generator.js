import Letter from "./letter";
import LETTERS from "./letters";
import StarBurst from "./starburst";
export default class BlockGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    generate () {
        this.scene.letters.add(new Letter(this.scene,this.scene.center_width, 128, this.randomLetter()))
        this.scene.time.addEvent({ 
            delay: 3000, 
            callback: () => { 
                let letter = new Letter(this.scene,this.scene.center_width, 128, this.randomLetter());
                this.scene.playAudio("spawn");
                new StarBurst(this.scene, letter.x, letter.y, "0xffffff", true, false)
                this.scene.letters.add(letter); 
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