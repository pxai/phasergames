import Player from "./player";
import Pot from "./pot";

export default class Intro extends Phaser.Scene {
    constructor () {
        super({ key: "intro" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.playMusic();
        //this.logo = this.add.image(this.center_width, 100, "splash").setOrigin(0.5).setScale(0.8)
        this.showAnimations();
       this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
    }

    update () {
    }

    


    playMusic (theme="intro") {
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

    showAnimations() {
        this.initial();
        this.time.delayedCall(5000, () => this.getClose())
        this.time.delayedCall(2000, () => this.showText())
    }

    initial () {
        this.mirror = this.add.sprite(this.center_width + 150, 75, "mirror").setOrigin(0.5).setAlpha(0);
        this.anims.create({
            key: "mirror",
            frames: this.anims.generateFrameNumbers("mirror", { start: 0, end: 14 }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: "mirrorShow",
            frames: this.anims.generateFrameNumbers("mirror", { start: 15, end: 18 }),
            frameRate: 4,

        });

        this.anims.create({
            key: "playeridleintro",
            frames: this.anims.generateFrameNumbers("wizard", { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "playerwalkintro",
            frames: this.anims.generateFrameNumbers("wizard", { start: 5, end: 8 }),
            frameRate: 5,
            repeat: -1
        });

        this.player = this.add.sprite(this.center_width - 150, 75, "wizard").setOrigin(0.5);
        this.player.anims.play("playeridleintro", true)
        this.mirror.anims.play("mirror", true)
        this.tweens.add({
            targets: [this.mirror, this.player],
            alpha: { from: 0, to: 1},
            duration: 5000,
        })
    }

    getClose () {
        this.player.anims.play("playerwalkintro", true)
        let changed = false
        this.tweens.add({
            targets: this.player,
            x: { from: this.center_width - 150, to: this.center_width + 100},
            duration: 5000,
            onUpdate: (time, player) => {
                if (player.x > this.center_width + 50 && !changed) {
                    changed = true;
                    console.log("Finally!! ", player.x)
                    this.mirror.anims.play("mirrorShow", true)
                    this.player.anims.stop();
                }
            }
        })
    }

    showText() {
        const text = "Once upon a time,\nthere was a weezard\nwho got close\nto a magic mirror.\n\n" +
                     "The mirror caught\nhis reflection and \n¡it spawned other weezards!\n" + 
                     "¡Help the weezard!\n\nFind the mirror\nand avoid his reflections.\n"+
                     "Pick potions to cast spells,\nthat will confuse them...";
        this.characters = [];
        let jump = 0;
        let line = 0;
        text.split("").forEach( (character, i) => {
            if (character === "\n") { jump++; line = 0 }
            this.characters.push(this.add.bitmapText(this.center_width - 350 + (line++ * 25), 150 + (jump * 30), "wizardFont", character, 22).setAlpha(0))
        })
        const timeline = this.tweens.createTimeline();
        this.characters.forEach( (character, i) => {
            timeline.add({
                targets: character,
                alpha: { from: 0, to: 0.5},
                duration: 100,
            })
        })

        timeline.play();

    }

    loadNext(sceneName) {
        console.log("Loading next! ");
        this.scene.start('game')
    }
}
