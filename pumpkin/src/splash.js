import scenes from "./scenes";

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
        this.playMusic();
        this.logo = this.add.image(this.center_width, 100, "splash").setOrigin(0.5).setScale(0.8)
        this.pello = this.add.image(this.center_width, this.height - 155, "pellopx").setOrigin(0.5).setScale(0.3)
        this.flickerLogo();
        this.textInstruction1 = this.add.bitmapText(this.center_width, 250, "wizardFont", "Use ARROW keys", 30).setTint(0x902406).setOrigin(0.5)
        this.textInstruction2 = this.add.bitmapText(this.center_width, 300, "wizardFont", "ENTER to continue", 25).setTint(0x902406).setOrigin(0.5)
        this.textInstruction3 = this.add.bitmapText(this.center_width, this.height - 50, "wizardFont", "A game by Pello", 15).setTint(0x902406).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.showText();
        this.registry.set('lives', 5)
        this.registry.set('coins', 0)
        this.prepareScenes();
        this.sound.add("spooky4").play();
    }

    update () {
    }

    flickerLogo () {
        const timeline = this.tweens.createTimeline();
        timeline.add({
            targets: this.logo,
            alpha: { from: 0, to: 1},
            duration: 200,
            repeat: 6
          });

          timeline.add({
              targets: this.logo,
              alpha: { from: 0, to: 1},
              duration: 2000,
          });

      timeline.play();
    }

    showText() {
        this.tweens.add({
            targets: [this.textInstruction1, this.textInstruction2, this.pello, this.textInstruction3],
            alpha: { from: 0, to: 1},
            duration: 4000,
        })
    }

    prepareScenes () {
        this.scenes = [ 
          scenes[0], 
          ...scenes.slice(1,scenes.length - 1).sort(() => 0.5 - Math.random()),
          scenes[scenes.length - 1]
        ];
        console.log(this.scenes)
    } 

    loadNext(sceneName) {
        console.log("Loading next! ");
        this.scene.start('intro', {index: -1, scenes: this.scenes })
    }

    playMusic (theme="muzik2") {
        this.sound.stopAll();
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
}
