import Starfield from "./objects/starfield";

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
        this.starfield = new Starfield(this);

        this.cameras.main.setBackgroundColor(0x494d7e);
        this.showLogo();        
        this.showShip();
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.starfield.generate();
    }

    startGame () {
        this.starfield.stop();
        this.scene.start("transition", {name: "STAGE", number: 1, time: 30})
    }
    showLogo() {
        this.gameLogo = this.add.image(this.center_width*2, 120, "logo").setScale(0.28).setOrigin(0.5)
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            x: {
              from: this.center_width * 2,
              to: this.center_width
            },
          })
    }

    showShip(){
        this.player = this.add.image(this.center_width, 300, "ship").setOrigin(0.5)
        this.tweens.add({
            targets: this.player,
            duration: 500,
            x: {
              from: -200,
              to: this.center_width
            },
          })
          this.tweens.add({
            targets: this.player,
            duration: 1000,
            y: this.player.y - 20,
            repeat: -1,
            yoyo: true
          })
    }

    showInstructions() {
        this.add.bitmapText(this.center_width, 350, "pixelFont", "Pick Containers", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 400, "pixelFont", "Avoid Asteroids", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 450, "pixelFont", "Pick & Shoot Marbles", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 120, 520, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 520, "pixelFont", "By PELLO, JUNE & JOSU", 15).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 570, "pixelFont", "Press SPACE to start", 30).setOrigin(0.5);
    }

    update () {
        this.starfield.update();
    }
}
