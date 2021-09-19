export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        console.log("Transition!!", data);
        this.index = data.index;
        this.scenes = data.scenes;
    }

    preload () {
        console.log("transition to ", this.scenes);
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.titleTest = this.add.bitmapText(this.center_width, this.center_height, "wizardFont", "DOOR OPENED, READY?", 30).setTint(0x902406).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.door = this.sound.add("door");
        this.door.play();
        this.logo = this.add.image(this.center_width, this.height - 80, "splash").setOrigin(0.5).setScale(0.6)
        this.coinsText = this.add.bitmapText(740, 40, "wizardFont", this.registry.get("coins"), 20).setTint(0x902406).setOrigin(0.5);
        this.add.image(700, 20, "coin").setOrigin(0.5)
        Array(+this.registry.get("lives")).fill(0).forEach( (heart, i) => {
            this.add.image(20 + (30 * i), 20, "heart1").setOrigin(0.5)
          })
        this.time.delayedCall(4000, () => this.loadNext());
    }

    update () {
    }

    loadNext(sceneName) {
        console.log("Loading next! ");
        this.sound.stopAll();
        this.index++;
        this.scene.start("game", {index: this.index, scenes: this.scenes });
    }
}
