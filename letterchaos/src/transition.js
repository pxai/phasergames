import { SingleLetter } from "./letter";
import LETTERS from "./letters";

export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
    }

    preload () {
    }

    create () {
        const messages = {
            "game": "ARROWS/WASD + SPACE",
            "underwater": "You lost your engine!",
            "depth": "Time to go down!",
            "escape": "Go up and escape!",
            "outro": "You did it!!"
        }
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.add.bitmapText(this.center_width, 50, "pixelFont", "Remember!!", 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height - 225, "pixelFont", "Right click to\nshuffle single letter", 30).setOrigin(0.5)
        this.addChangingLetter();
        this.addMouse(this.center_width + 200, this.center_height - 125, "mouse1")
        this.add.bitmapText(this.center_width, this.center_height - 75, "pixelFont", "Up to 3 times", 20).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 25, "pixelFont", "Right click to solve word", 30).setOrigin(0.5)
        this.addLetters();
        this.addMouse(this.center_width + 200, this.center_height + 125, "mouse2")
        this.add.bitmapText(this.center_width, this.center_height + 225, "pixelFont", "50 letters = OVERLOAD & GAMEOVER", 30).setOrigin(0.5)


        this.space = this.add.bitmapText(this.center_width, 750, "pixelFont", "CLICK HERE to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });

        this.space.setInteractive();
        this.space.on('pointerdown', () => {
            this.startGame()
        })
    }

    addMouse (x, y, name) {
        const mouseIcon = this.add.sprite(x, y, "mouse").setScale(0.8);
        this.anims.create({
            key: name,
            frames: this.anims.generateFrameNumbers("mouse", { start: 0, end:1 }),
            frameRate: 3,
            repeat: -1
        });

        mouseIcon.anims.play(name, true);
    }

    update () {
    }

    addChangingLetter() {
        this.time.addEvent({ delay: 500, callback: () =>{             
            this.add.existing(new SingleLetter(this, this.center_width , this.center_height - 150, this.randomLetter()));
        }, callbackScope: this, loop: true });
        
    }

    addLetters () {
        const points = [4, 1, 1, 2, 1];
        "WORDS".split("").forEach((letter, i) => {
            this.add.existing(new SingleLetter(this, (this.center_width - 125 ) + 48 * (i + 1), this.center_height + 75, { letter, points: points[i]}));
        })
    }

    randomLetter () {
        const letters = LETTERS["en"];
        return letters[Phaser.Math.Between(0, letters.length - 1)];
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.game.sound.stopAll();

        this.sound.add("success").play();
        this.scene.start("game")
    }

}
