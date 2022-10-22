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
        //this.play = this.add.sprite(this.center_width, 170, "record").setOrigin(0.5).setAlpha(0)
        this.tweens.add({
            targets: [this.text1, this.text2, this.play],
            duration: 1000,
            alpha: {from: 0, to: 1},
            onComplete: () => {
                this.playDiary();
            }
        })
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);''
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
            this.sound.add("creepy").play({
                mute: false,
                volume: 1,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: true,
                delay: 0
              })
        }.bind(this))
        this.recording.play();
      }

    update () {
    }

    showMission () {
        this.text3 = this.add.bitmapText(this.center_width, 300, "pico", "MISSION OBJECTIVE", 30).setOrigin(0.5)
        this.text4 = this.add.bitmapText(this.center_width, 400, "pico", this.missions[this.number], 20).setOrigin(0.5)
    }

    loadNext () {
        //this.sound.add("cock").play();
        console.log('Start scene: ', this.number);
        
        this.sound.stopAll();
        this.scene.start("game", {  number: this.number });
    }
}
