import Utils from "./utils";

export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.number = data.number;
    }

    preload () {
    }

    create () {
        const messages = [
            "DAY 0",
            "DAY 1",
            "DAY 2",
            "DAY 3",
            "DAY 4",
            "DAY 5",
            "DAY 6",
            "DAY 7"
        ];

        this.missions = [
            "LOCATE WRECKAGE AT POINT 121º 221º",
            "Locate wreckage at point 121º 221º",
            "Locate wreckage at point 121º 221º",
            "Locate wreckage at point 121º 221º",
            "Locate wreckage at point 121º 221º",
            "Locate wreckage at point 121º 221º",
            "Locate wreckage at point 121º 221º",
        ];

        this.utils = new Utils(this);
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2; 
        this.add.tileSprite(0, 0, 800, 600, "landscape").setOrigin(0);
        this.sound.stopAll();
        if (this.number === 8) {
            this.scene.start("outro", { number: this.number });
        }

        this.text1 = this.add.bitmapText(this.center_width, 20, "pico", messages[this.number], 30).setOrigin(0.5).setAlpha(0)
        this.text2 = this.add.bitmapText(this.center_width, 70, "pico", "AUDIO RECORD OF CAPTAIN BRAUN", 20).setOrigin(0.5).setAlpha(0)

        if (this.number > 0) {
            //this.play = this.add.sprite(this.center_width, 170, "record").setOrigin(0.5).setAlpha(0)
            this.tweens.add({
                targets: [this.text1, this.text2, this.play],
                duration: 1000,
                alpha: {from: 0, to: 1},
                onComplete: () => {
                    this.playDiary();
                }
            })
        } else {
            this.text2 = this.add.bitmapText(this.center_width, 70, "pico", "THE CRASH", 20).setOrigin(0.5).setAlpha(0)
            this.playCreepy();
            this.tweens.add({
                targets: [this.text1],
                duration: 2000,
                alpha: {from: 0, to: 1},
                onComplete: () => {
                    this.playIntro();
                }
            })
        }

        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
    }

    playIntro () {
        const text =
            "YOU JUST CRASHED ON MARS\n"+
        "YOU ARE ALIVE BUT YOUR\n"+
        "SHIP IS COMPLETELY LOST\n" +
        "IF YOU WANT TO LIVE YOU\n" +
        "MUST FIND LANDING REMAINS...";

        this.utils.typeText(text, "pico", this.center_width, 150, 0xffffff, 20)
    }

    playDiary () {
        this.wave = this.add.sprite(this.center_width, 200, "wave").setOrigin(0.5)
        this.anims.create({
            key: "wave",
            frames: this.anims.generateFrameNumbers("wave", { start: 0, end: 4 }),
            frameRate: 20,
            repeat: -1
          });
        this.wave.anims.play("wave", true)
        this.recording = this.sound.add(`diary${this.number}`)
        this.recording.on('complete', function () {
            //log("Dale fin")
            this.wave.destroy();
            this.showMission();
            this.playCreepy();
        }.bind(this))
        this.recording.play();
      }
    
      playCreepy() {
        this.creepy = this.sound.add("creepy")
        this.creepy.play({
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
          })
      }

    update () {
    }

    showMission () {
        this.text3 = this.add.bitmapText(this.center_width, 300, "pico", "MISSION OBJECTIVE", 30).setOrigin(0.5)
        //this.text4 = this.add.bitmapText(this.center_width, 400, "pico", this.missions[this.number], 20).setOrigin(0.5)

        this.utils.typeText(this.missions[this.number], "pico", this.center_width, 400, 0xffffff, 20)
    }

    loadNext () {
        //this.sound.add("cock").play();
        console.log('Start scene: ', this.number);
        
        this.sound.stopAll();
        this.scene.start("game", {  number: this.number });
    }
}
