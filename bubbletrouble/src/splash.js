export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.gameLayer = this.add.layer();
        this.tvLayer = this.add.layer();

        this.cameras.main.setBackgroundColor(0x000000);
        this.showtitle();        ;
        this.time.delayedCall(100, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        //this.playMusic();
        //this.showPlayer();
        this.addTvEffect();
    }

    addTvEffect (lineSpacing = 4, color = 0x000000, alpha = 1) {
        for (let y = 0; y < this.scale.height; y += lineSpacing) {
            this.tvLayer.add(this.add.rectangle(this.center_width, y, this.scale.width, 1, color).setAlpha(alpha));
        }
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("transition", {next: "game", name: "STAGE", number: 1, time: 30})
    }

    showtitle() {
        this.title1 = this.add.bitmapText(this.center_width, 50, "pixelFont", "BUBBLE", 80).setOrigin(0.5);
        this.title2 = this.add.bitmapText(this.center_width, 150, "pixelFont", "TROUBLE", 80).setOrigin(0.5);
        this.gameLayer.add(this.title1);
        this.gameLayer.add(this.title2);
    }

    showPlayer () {

    }

    playMusic (theme="splash") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }


    showInstructions() {
        this.gameLayer.add(this.add.bitmapText(this.center_width, 450, "pixelFont", "WASD/Arrows: move", 30).setOrigin(0.5));
        this.gameLayer.add(this.add.bitmapText(this.center_width, 500, "pixelFont", "SPACE: track beam", 30).setOrigin(0.5));
        this.gameLayer.add(this.add.bitmapText(this.center_width, 550, "pixelFont", "B: shoot coins", 30).setOrigin(0.5));
        this.gameLayer.add(this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.3))
        this.gameLayer.add(this.add.bitmapText(this.center_width + 40, 620, "pixelFont", "By PELLO", 15).setOrigin(0.5));
        this.gameLayer.add(this.space = this.add.bitmapText(this.center_width, 670, "pixelFont", "Press SPACE to start", 30).setOrigin(0.5));
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
