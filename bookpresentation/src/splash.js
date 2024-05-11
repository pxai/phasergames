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
        this.generateBubble()

        this.cameras.main.setBackgroundColor(0x000000);
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);

        //this.showPlayer();
    }
    update() {
        if (Phaser.Math.Between(0, 5) > 4)
            this.generateBubble();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.playMusic("game")
        this.scene.start("transition", {next: "game", name: "STAGE", number: 1})
    }

    showLogo() {
        this.gameLogo = this.add.image(this.center_width*2, -200, "logo").setScale(1.2).setOrigin(0.5)
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            x: {
              from: this.center_width,
              to: this.center_width
            },
            y: {
                from: -200,
                to: 200
              },
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
        new MovingBubble(this, Phaser.Math.Between(0, this.width), 800, 100, -1, 20000)
    }

    showInstructions() {
        this.add.bitmapText(this.center_width, 450, "pixelFont", "MOUSE TO MOVE", 30).setOrigin(0.5).setTint(0x0777b7).setDropShadow(1, 2, 0xffffff, 0.7);
        this.add.bitmapText(this.center_width, 500, "pixelFont", "SPACE: DASH", 30).setOrigin(0.5).setTint(0x0777b7).setDropShadow(1, 2, 0xffffff, 0.7);
        this.add.bitmapText(this.center_width, 550, "pixelFont", "RIGHT CLICK: SHOOT", 30).setOrigin(0.5).setTint(0x0777b7).setDropShadow(1, 2, 0xffffff, 0.7);
        this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 620, "pixelFont", "By PELLO", 15).setOrigin(0.5).setTint(0x0777b7).setDropShadow(1, 2, 0xffffff, 0.7);
        this.space = this.add.bitmapText(this.center_width, 670, "pixelFont", "Click here/Press SPACE to start", 30).setOrigin(0.5).setTint(0x0777b7).setDropShadow(1, 2, 0xffffff, 0.7);
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
