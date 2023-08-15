import Letter from "./letter";
import letterValues from "./letters";

export default class LetterGenerator {
    constructor(scene) {
        this.scene = scene;
        this.generate();
    }

    generate () {
        const {x, y} = this.scene.spawnPoint;
        this.scene.letters.add(new Letter(this.scene, x + 16, y + 16, this.randomLetter()))
        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                let letter = new Letter(this.scene, x + 16, y + 16, this.randomLetter());
                //this.scene.playAudio("spawn");
                // new StarBurst(this.scene, letter.x, letter.y, "0xffffff", true, false)
                this.scene.letters.add(letter);
                this.scene.gameLayer.add(letter);
                //this.scene.updateLetterCount();
                //this.scene.checkGameOver();
            },
            callbackScope: this,
            loop: true
        });
    }

    getPointsForLetter (letter) {
        return letterValues['en'][letter.toLowerCase()] || 1;
    }

    randomLetter () {
        const letters = Object.keys(letterValues["en"]);
        const letter = letters[Phaser.Math.Between(0, letters.length - 1)].trim();
        console.log("Generating: ", letter, {letter, points: this.getPointsForLetter(letter)})
        return {letter, points: this.getPointsForLetter(letter)};
    }

    update () {}
}