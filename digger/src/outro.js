export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.splashLayer = this.add.layer();
        this.cameras.main.setBackgroundColor(0x000000);

        this.addPlayer();
        this.setScore();
        this.sound.add("death").play();
        this.add.bitmapText(this.center_width, this.center_height - 50, "pusab", "GAME OVER", 80).setOrigin(0.5).setTint(0xFF8700);
        this.startButton  = this.add.bitmapText(this.center_width, 670, "pusab", "Click to restart", 60).setOrigin(0.5).setTint(0xFF8700).setDropShadow(3, 4, 0x222222, 0.7);;
        this.tweens.add({
            targets: this.startButton,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
        this.input.on('pointerdown', (pointer) => this.startSplash(), this);
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
    }

    setScore() {
       this.scoreText = this.add.bitmapText(this.center_width, 40, "pusab", String(this.registry.get("score")).padStart(6, '0'), 60).setOrigin(0.5).setTint(0xFF8700).setScrollFactor(0)
      }


    playMusic (theme="outro") {
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

    startSplash () {
        // this.theme.stop();
        this.scene.start("splash");
    }


    addPlayer () {
        this.player = this.add.sprite(this.center_width, this.center_height + 100, "player").setScale(3)
        this.anims.create({
            key: "playeridle",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end:6 }),
            frameRate: 10,
            repeat: -1
        });

        this.tweens.add({
            targets: this.player,
            duration: 200,
            y: "+=10",
            repeat: -1,
            yoyo: true
        });

        this.player.anims.play("playeridle", true);
    }
}
