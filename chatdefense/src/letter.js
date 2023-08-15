import LETTERS from "./letters";
import EasyStar from "easystarjs";
import { Dust, Explosion } from "./particle";

export default class Letter extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter = "", demo = false) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.letter = letter;
        this.sticky = false;
        this.demo = demo;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);


        this.add(new SingleLetter(this.scene, 0, 0, this.letter, this.demo))
        this.letterLength = 1;
        this.change = 0;
        this.body.setSize(32, 32)
        this.body.setOffset(-16, -16)

        this.easystar = new EasyStar.js();
        this.easystar.setGrid(this.scene.grid);
        this.easystar.setAcceptableTiles([0]);
        if (!this.demo)
            this.launchMove();
    }

    get length () {
        return this.getWord().word.length;
    }

    selectIt() {

    }

    addLetters(letters) {
        letters.forEach((letter, i) => {
            this.add(new SingleLetter(this.scene, 42 * this.letterLength, 0, letter, this.demo))
            this.letterLength++;
        })

        //this.changeLetterColor(0xccddccf)
    }


    setColor (color) {
        this.square.setFillStyle(color);
    }

    getWord () {
        let word = "";
        let points = 0;

        this.iterate( singleLetter => {
            if (singleLetter.type === 'Container') {
                word += singleLetter.letter['letter'];
                points += singleLetter.letter['points'];
            }
        })

        return {
            word,
            points
        };
    }

    getLetters () {
        let letters = [];

        this.iterate( singleLetter => {
            if (singleLetter.type === 'Container') {
                letters.push(singleLetter.letter)
            }
        })

        return letters;
    }

    changeLetterColor (color = 0xfcae1e) {
        const letters = this.getAll("name", "SingleLetter");
        letters.forEach( singleLetter => {
            singleLetter.squareBack.setFillStyle(color);
        })
    }

    launchMove() {
        if (!this.scene) return;
        this.delayedMove = this.scene.time.addEvent({
            delay: 2000,                // ms
            callback: this.move.bind(this),
            startAt: 0,
            callbackScope: this,
            loop: true
        });
      }

      move () {
        try {
            if (this.moveTimeline) this.moveTimeline.destroy();
            if (this.scene && this.scene.gameOver) return;

            this.easystar.findPath(Math.floor(this.x/32), Math.floor(this.y/32), Math.floor(this.scene.castle.x/32), Math.floor(this.scene.castle.y/32), this.moveIt.bind(this));
            this.easystar.setIterationsPerCalculation(1000);
            this.easystar.enableSync();
            this.easystar.calculate();
        } catch (err) {
            console.log("Cant move yet: ", err)
        }

    }

    moveIt (path) {
        if (path === null) {
            console.log("Path was not found.");
        } else {
            let tweens = [];
            this.i = 0;
            this.path = path;
            for(let i = 0; i < path.length-1; i++){
                let ex = (path[i+1].x * 32) + 16;
                let ey = (path[i+1].y * 32) + 16;
                this.scene.dustLayer.add(new Dust(this.scene, this.x, this.y, 1));
                tweens.push({
                    targets: this,
                    duration: 10000/this.scene.speed,
                    x: ex,
                    y: ey
                });
            }

            this.moveTimeline = this.scene.tweens.timeline({
                tweens: tweens,
                onComplete: () => {
                    this.delayedMove.remove()
                    if (this.alpha > 0)
                      this.launchMove();
                }
            });
        }
    }

    // destroy() {
    //     this.iterate(child => new Explosion(this.scene, child.x, child.y + 32, 1, 0.5));
    //     super.destroy();
    // }
}

export class SingleLetter extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter = "", demo = false) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.letter = letter;
        this.name = "SingleLetter";
        this.demo = demo;

        this.squareBack = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 32, 32, 0xcccccc).setOrigin(0.5);
        //this.squareBack.setScale(0.8)
        this.add(this.squareBack);

        this.square = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "letter").setTint(0x000000).setOrigin(0.5);
        this.add(this.square);

        this.letterText = new Phaser.GameObjects.BitmapText(this.scene, 0, -3, "mainFont", this.letter['letter'].toUpperCase(), 16).setTint(0x000000).setOrigin(0.5)
        this.add(this.letterText);

        this.letterPoints = new Phaser.GameObjects.BitmapText(this.scene, 0, 8, "mainFont", this.letter['points'], 8).setTint(0x000000).setOrigin(0.5);
        this.add(this.letterPoints);

        if (!this.demo) this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            yoyo: true,
            duration: 400,
            rotation: {from: -0.1, to: 0.1},
            repeat: -1
        });

        this.scene.tweens.add({
            targets: this,
            y: "-=5",
            yoyo: true,
            duration: 400,
            repeat: -1
        });
    }

    setLetter (letter) {
        this.letter = letter;
        this.letterText.setText(this.letter['letter']);
        this.letterPoints.setText(this.letter['points'])
    }
}
