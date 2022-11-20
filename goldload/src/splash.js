import { MovingBubble } from "./bubble";
export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
    }

    create () {
        this.playMusic();
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.bubbleLayer = this.add.layer();
       //this.generateBubble()

        this.cameras.main.setBackgroundColor(0x000000);
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
        //this.showPlayer();
    }
    update() {
        if (Phaser.Math.Between(0, 11) > 10)
            this.generateBubble();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.playMusic("game")
        this.scene.start("transition", {next: "game", name: "STAGE", number: 0})
    }

    showLogo() {
        this.gameLogo1 = this.add.bitmapText(this.center_width, this.center_height - 250, "pixelFont", "GET RICH", 100).setTint(0x0eb7b7).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.gameLogo2 = this.add.bitmapText(this.center_width, this.center_height - 150, "pixelFont", "or", 100).setTint(0x0eb7b7).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.gameLogo3 = this.add.bitmapText(this.center_width, this.center_height - 50, "pixelFont", "DIE TRYING", 100).setTint(0x0eb7b7).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);

        this.tweens.add({
            targets: [this.gameLogo1, this.gameLogo2, this.gameLogo3],
            duration: 1000,
            x: "+=10",
            y: "-=10",
            yoyo: true,
            duration: 2000,
            repeat: -1
          })
    }

    showPlayer () {

    }

    playMusic (theme="splash") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.5,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
    }

    generateBubble () {
        this.bubbleLayer.add(new MovingBubble(this, Phaser.Math.Between(0, this.width), 800, 100, -1, 20000))
    }

    showInstructions() {
        this.add.bitmapText(this.center_width, 480, "pixelFont", "MOUSE TO MOVE", 30).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7);
       this.add.bitmapText(this.center_width, 550, "pixelFont", "RIGHT CLICK: DROP GOLD", 30).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7);
        this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 620, "pixelFont", "By PELLO", 15).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7);
        this.space = this.add.bitmapText(this.center_width, 670, "pixelFont", "Click to start", 30).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });

        this.space.setInteractive();
        this.space.on('pointerdown', () => {
            this.sound.add("ember").play()
            this.startGame()
        })
    }
}
