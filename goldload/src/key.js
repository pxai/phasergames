export default class Key extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter, callback) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.callback = callback;
        this.letter = letter === "ñ" ? "n" : letter;
        this.scene.add.existing(this);
        this.square = new Phaser.GameObjects.Rectangle(this.scene, 64, 32, 58, 58, 0x666666).setOrigin(0.5).setAlpha(0)
        this.add(this.square);
        this.letterText = new Phaser.GameObjects.BitmapText(this.scene, 64, 32, "pixelFont", this.letter.toUpperCase(), 60).setOrigin(0.5)
        this.add(this.letterText);
            this.setListeners();
    }

    setColor (color) {
        this.square.setFillStyle(color);
    }

    setListeners () {
        this.letterText.setInteractive();
        this.backupColor = this.square.fillColor;
        this.letterText.on('pointerdown', () => {
            //this.scene.playAudio("key");
            this.callback(this.letter)
            this.letterText.setTint(0xca6702)
            this.square.setAlpha(1)
        });

        this.letterText.on('pointerover', () => {
            this.square.setAlpha(1);
            this.depthBackup = this.depth; 
            this.letterText.setTint(0xca6702)
            //this.scene.playAudio("over");
            this.depth = 10;
            //this.setScale(1.2)
        })

        this.letterText.on('pointerout', () => {
            this.square.setFillStyle(0x666666);
            this.depth = 0;
            this.square.setAlpha(0)
            this.letterText.setTint(0xffffff)
            //this.setScale(1)
        });
    }
}
