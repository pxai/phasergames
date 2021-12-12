import Die from "./die";

export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    preload () {
        this.failed = this.registry.get("health") == "0";
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = this.setText();
        this.showHistory();
        //this.showPlayer();
        this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }

    setText () {
        if (this.failed)
            return [ 
                "You failed!",
                "You will be trapped forever",
                "in this terrible castle",
                "with nothing to play",
                "unless you try again..."
            ];

        return [ 
            "You Won!!",
            "Your skills are worthy!",
            "Now you can leave this game",
            "and get a life.",
            "unless you want to try again..."
        ];
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 100), null, this); 
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this); 
    }
    
    showPlayer() {
        this.player = this.add.sprite(this.center_width, 600, "wizard");
        this.anims.create({
            key: "playeridle",
            frames: this.anims.generateFrameNumbers("wizard", { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });
        this.player.anims.play("playeridle", true)
        const dice = [1, 2, 3, 4, 5, 6]
        dice.forEach( die => {
            this.add.image(150 + (die*100), 670, `d${die}`)
        })
    }

    playMusic () {
        const theme = this.failed ? "gameover" : "win";
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

    showLine(text, y) {
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "wizardFont", text, 25).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }


    startSplash () {
        this.theme.stop();
        this.scene.start("splash");
    }
}
