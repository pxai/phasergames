import StarBurst from "./starburst";
import LETTERS from "./letters";
import { Particle } from "./particle";

export default class Letter extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter = "", demo = false) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.letter = letter;
        this.sticky = false;

        this.scene.add.existing(this);



        this.add(new SingleLetter(this.scene, 0, 0, this.letter))
        this.letterLength = 1;
        this.change = 0;


        this.left = null;
        this.right = null;
        this.setSize(44, 44)

        this.setInteractive();

    }

    get length () {
        return this.getWord().word.length;
    }

    selectIt() {

    }

    addLetters(letters) {
        letters.forEach((letter, i) => {
            this.add(new SingleLetter(this.scene, 48 * this.letterLength, 0, letter))
            this.letterLength++;
        })

        this.changeLetterColor(0xccddccf);

        this.setSize(48 * this.letterLength, 48)


        new StarBurst(this.scene, this.x, this.y - 50, "0xffffff", false, true)
        this.scene.tweens.add({
            targets: this,
            duration: 50,
            x: "+=7",
            y: "+=7",
            repeat: 5
        });
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

    changeSticky (value) {
        let first = this;
        while (first.left !== null)
            first = first.left;

        while(first !== null) {
            first.sticky = value;
            first = first.right;
        }
    }

    getFirstLetter () {
        return this.iterate( child => {
            if (child.type === 'Container') {
                return child.list[0];
            }
         });
    }

     clearWord () {
         let i = 0;
         this.iterate(child => {
            if (child.type === 'Container') {
                //(scene, x, y, color = "0xffffff", launch = false, multi = false)
                new StarBurst(this.scene, this.x + (i*48), this.y, "0xffffff", true, true)
            }
             child.destroy();
             i++;
         });
     }

     randomLetter () {
        const letters = LETTERS["en"];
        return letters[Phaser.Math.Between(0, letters.length - 1)];
    }

    changeLetterColor (color = 0xfcae1e) {
        const letters = this.getAll("name", "SingleLetter");
        letters.forEach( singleLetter => {
            singleLetter.squareBack.setFillStyle(color);
        })
    }
}

export class SingleLetter extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter = "") {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.letter = letter;
        this.name = "SingleLetter";

        this.squareBack = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 48, 48, 0xffffff).setOrigin(0.5)
        this.add(this.squareBack);

        this.square = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "letter").setOrigin(0.5);
        this.add(this.square);

        this.letterText = new Phaser.GameObjects.BitmapText(this.scene, 0, -4, "mainFont", this.letter['letter'].toUpperCase(), 26).setTint(0x000000).setOrigin(0.5)
        this.add(this.letterText);

        this.letterPoints = new Phaser.GameObjects.BitmapText(this.scene, 0, 16, "mainFont", this.letter['points'], 8).setTint(0x000000).setOrigin(0.5);
        this.add(this.letterPoints);
    }

    setLetter (letter) {
        this.letter = letter;
        this.letterText.setText(this.letter['letter']);
        this.letterPoints.setText(this.letter['points'])
    }
}
