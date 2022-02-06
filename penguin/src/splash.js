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


        this.cameras.main.setBackgroundColor(0x64a7bd);
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.playMusic();
        //this.showPlayer();
        this.addSnow();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("transition", {next: "game", name: "STAGE", number: 1, time: 30})
    }

    showLogo() {
        this.gameLogo = this.add.image(this.center_width, 200, "logo").setScale(0.3).setOrigin(0.5).setAlpha(0.1)
        this.time.addEvent({ delay: 2000, callback: this.flickr, callbackScope: this, loop: true });
    }

    flickr () {
        this.tweens.add({
            targets: this.gameLogo,
            duration: Phaser.Math.Between(1000, 3000),
            alpha: {
              from: 0.2,
              to: 0.8
            },
            yoyo: true,
          })
    }

    addSnow() {
        this.particles = this.add.particles('flake');
        this.particles.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.2, end: 1.5 },
            tint: [0xffffff, 0xeeeeee, 0xdddddd ],
            speed: 20,
            accelerationY: {min: 100, max: 150 },
            accelerationX: { min: -50, max: -100},
            angle: { min: -85, max: -95 },
            rotate: { min: -180, max: 180 },
            lifespan: { min: 10000, max: 11000 },
            blendMode: 'ADD',
            frequency: 110,
            maxParticles: -1,
            x: {min: 0, max: 900},
            y: -100
        });
    }

    showPlayer () {

    }

    playMusic (theme="blizzard") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.7,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }
  

    showInstructions() {
        this.add.bitmapText(this.center_width, 550, "pixelFont", "Arrows to move", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 80, 610, "pellologo").setOrigin(0.5).setScale(0.4)
        this.add.bitmapText(this.center_width + 40, 605, "pixelFont", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 670, "pixelFont", "Press SPACE to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
