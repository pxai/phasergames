export default class Card extends Phaser.GameObjects.Container {
    constructor (scene, x, y, tile, index = 0) {
        super(scene, x, y) //"cards", index);

        this.scene = scene;
        console.log("Created tile ", tile)
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

    canApply () {
        return true;7
        // This is hard because player may create islands
        /*return Math.abs(this.tile.x - this.scene.currentCard.tile.x) < 2 &&
              Math.abs(this.tile.y - this.scene.currentCard.tile.y) < 2;*/
    }

    addListeners () {
        this.card.setInteractive();
        this.card.on("pointerdown", () => {
            if (this.canApply()) {
                this.scene.resolveCard(this);
            } else {
                this.scene.setForbiddenCursor();
            }
        });

        this.card.on("pointerover", () => {
            if (this.canApply()) {
                this.scene.setPickCursor();
                this.card.setTint(0x3E6875);
                this.card.setScale(1.1)
            } else {
                this.scene.setForbiddenCursor();
            }
        });

        this.card.on("pointerout", () => {
            this.card.setScale(1)
            this.card.setTint(this.scene.primaryColor);
            this.scene.setDefaultCursor();
        });
    }
}

