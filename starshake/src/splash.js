import SceneEffect from "./scene_effect";

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
        this.addBackground();
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.transitionToChange(), this);

        //this.playMusic();
        //this.showPlayer();
    }

    addBackground () {
        this.background = this.add.tileSprite(0, 0, this.width, this.height, "background").setOrigin(0).setScrollFactor(0, 1); 
      }

    transitionToChange() {
        new SceneEffect(this).simpleClose(this.startGame.bind(this));
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("transition", {next: "game", name: "STAGE", number: 1, time: 30})
    }

    update() {
        this.background.tilePositionY -= 2;
        this.background.tilePositionX += 2;
    }

    showLogo() {
        this.gameLogoShadow = this.add.image(this.center_width, 250, "logo").setScale(0.7).setOrigin(0.5)
        this.gameLogoShadow.setOrigin(0.48);
        this.gameLogoShadow.tint = 0x3e4e43;
        this.gameLogoShadow.alpha = 0.6;
        this.gameLogo = this.add.image(this.center_width, 250, "logo").setScale(0.7).setOrigin(0.5)


        const timeline = this.tweens.createTimeline();
        timeline.add({
            targets: [this.gameLogo, this.gameLogoShadow],
            duration: 500,
            y: {
                from: -200,
                to: 250
              },
          });

          timeline.add({
            targets: [this.gameLogo, this.gameLogoShadow],
            duration: 1500,
            y: {
                from: 250,
                to: 200,
              },
            repeat: -1,
            yoyo: true,
          })
          timeline.play();
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
        this.add.bitmapText(this.center_width, 450, "pixelFont", "WASD/Arrows: move", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 500, "pixelFont", "SPACE: track beam", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 550, "pixelFont", "B: shoot coins", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 620, "pixelFont", "By PELLO", 15).setOrigin(0.5);
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
