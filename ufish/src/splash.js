import Starfield from "./objects/sky";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        console.log("splash");
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;


        this.cameras.main.setBackgroundColor(0x008080);
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);

    }

    startGame () {
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: 1, time: 30})
    }

    showLogo() {
        this.gameLogo = this.add.image(this.center_width*2, 130, "logo").setScale(0.28).setOrigin(0.5)
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            x: {
              from: this.center_width * 2,
              to: this.center_width
            },
          })
    }

  

    showInstructions() {
        this.add.bitmapText(this.center_width, 350, "pixelFont", "WASD/Arrows to move", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 400, "pixelFont", "SPACE track beam", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 450, "pixelFont", "B shoot coins", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 120, 520, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 520, "pixelFont", "By PELLO", 15).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 570, "pixelFont", "Press SPACE to start", 30).setOrigin(0.5);
    }
}
