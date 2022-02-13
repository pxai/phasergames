export default class Key extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.letter = letter === "ñ" ? "n" : letter;
        this.scene.add.existing(this);
        this.square = new Phaser.GameObjects.Rectangle(this.scene, 64, 32, 48, 48, 0x666666).setOrigin(0.5)
        this.add(this.square);

        this.keycup = new Phaser.GameObjects.Sprite(this.scene, 64, 32, "keycup").setOrigin(0.5);
        this.add(this.keycup);
        this.letterText = new Phaser.GameObjects.BitmapText(this.scene, 64, 32, "font2", this.letter.toUpperCase(), 30).setOrigin(0.5)
        this.add(this.letterText);

        this.setListeners();
    }

    setColor (color) {
        this.square.setFillStyle(color);
    }

    setListeners () {
        this.keycup.setInteractive();
        this.keycup.on('pointerdown', () => {
            if (!this.scene.enabled) return;
            this.scene.playAudio("key");
            this.scene.clickedLetter(this.letter)
            this.square.setFillStyle(0x00ff00);
            if (/^[a-z]{1}$/.test(this.letter) )
                this.scene.penguin.moveIt();
        });

        this.keycup.on('pointerover', () => {
            if (!this.scene.enabled) return;
            this.backupColor = this.square.fillColor;
            this.square.setFillStyle(0x00eeee);
            this.depthBackup = this.depth; 
            this.scene.playAudio("over");
            this.depth = 10;
            this.scene.setHelpText(this.letter)
            //this.setScale(1.2)
        })

        this.keycup.on('pointerout', () => {
            this.square.setFillStyle(this.backupColor);
            this.depth = 0;
            this.scene.setHelpText("")
            //this.setScale(1)
        });
    }
}
