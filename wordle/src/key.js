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
        //this.scene.add.existing(new Phaser.GameObjects.BitmapText(this.scene, 20, 550, "pixelFont", "a", 30));
        this.letterText = new Phaser.GameObjects.BitmapText(this.scene, 64, 32, "font2", this.letter.toUpperCase(), 30).setOrigin(0.5)
        this.add(this.letterText);

        this.setListeners();
    }

    setListeners () {
        this.keycup.setInteractive();
        this.keycup.on('pointerdown', () => {
            this.scene.clickedLetter(this.letter)
            this.square.setFillStyle(0x00ff00);
        });

        this.keycup.on('pointerover', () => {
            this.square.setFillStyle(0x00eeee);
            this.depthBackup = this.depth; 
            this.depth = 10;
            console.log(this.depth)
            this.setScale(1.2)
        })

        this.keycup.on('pointerout', () => {
            this.square.setFillStyle(0x666666);
            this.depth = 0;
            console.log(this.depth)
            this.setScale(1)
        });
    }
}
