export default class Card extends Phaser.GameObjects.Container {
    constructor (scene, x, y, tile, index = 0) {
        super(scene, x, y) //"cards", index);

        this.scene = scene;
        this.tile = tile;
        this.index = index;

        this.scene.add.existing(this);

        this.card = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "cards", index).setTint(this.scene.primaryColor).setOrigin(0.5);
        this.scene.add.existing(this.card) // Apparently mecessary if you want to animate
        this.add(this.card)
        this.init();
        this.addListeners();
    }

    init () {
        this.scene.anims.create({
            key: "back",
            frames: this.scene.anims.generateFrameNumbers("cards", { start: 0, end: 1 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: "flip",
            frames: this.scene.anims.generateFrameNumbers("cards", { start: 4, end: 10 }),
            frameRate: 10,
        });

        this.card.anims.play("back", true);
    }

    addListeners () {
        this.card.setInteractive();
        this.card.on("pointerdown", () => {
            
        });

        this.card.on("pointerover", () => {
            this.card.setTint(0x3E6875);
            this.card.setScale(1.1)
        });

        this.card.on("pointerout", () => {
            this.card.setScale(1)
            this.card.setTint(this.scene.primaryColor);
        });
    }
}

