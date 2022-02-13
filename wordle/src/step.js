export default class Step extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter = "") {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.letter = letter === "ñ" ? "n" : letter;
        this.scene.add.existing(this);
        this.square = new Phaser.GameObjects.Rectangle(this.scene, 64, 32, 48, 48, 0xffffff).setOrigin(0.5)
        this.add(this.square);

        this.keycup = new Phaser.GameObjects.Sprite(this.scene, 64, 32, "letter").setOrigin(0.5);
        this.add(this.keycup);
        //this.scene.add.existing(new Phaser.GameObjects.BitmapText(this.scene, 20, 550, "pixelFont", "a", 30));
        this.letterText = new Phaser.GameObjects.BitmapText(this.scene, 64, 32, "pixelFont", this.letter.toUpperCase(), 40).setTint(0x000000).setOrigin(0.5)
        this.add(this.letterText);
    }

    setLetter (letter = "") {
        this.letterText.setText(letter);
    }

    setColor (color) {
        this.square.setFillStyle(color);
    }
}
