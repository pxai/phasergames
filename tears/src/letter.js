export default class Letter extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter = "", demo = false) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.letter = letter;
        this.sticky = false;
        
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true)
        this.body.setSize(48, 48)

        this.body.collideWorldBounds = true;
        this.add(new SingleLetter(this.scene, 0, 0, this.letter))
        this.letterLength = 1;
        this.change = 0;
        this.setSize(48, 48)
        this.scene.letters.add(this);
        this.scene.time.delayedCall(1500, () => { 
            this.blink()
        }, null, this);
    }

    setColor (color) {
        this.square.setFillStyle(color);
    }

    blink () {
        this.scene.tweens.add({
            targets: this,
            duration: 50,
            alpha: {from: 1, to: 0.2},
            repeat: 10,
            onComplete: () => { this.destroy()  }
        });
    }
}

export class SingleLetter extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter = "") {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene
        this.letter = letter;
        this.name = "SingleLetter";

        this.square = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "letter").setOrigin(0.5);
        this.add(this.square);

        this.letterText = new Phaser.GameObjects.BitmapText(this.scene, 0, -4, "type", this.letter, 26).setTint(0x000000).setOrigin(0.5)
        this.add(this.letterText);
    }

    setLetter (letter) {
        this.letter = letter;
        this.letterText.setText(this.letter['letter']);
    }
}
