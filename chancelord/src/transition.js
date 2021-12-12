export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
        this.next = data.next;
    }

    preload () {
    }

    create () {
        const messages = {
            "game": "ARROWS/WASD + SPACE",
            "underwater": "You lost your engine!",
            "depth": "Time to go down!",
            "escape": "Go up and escape!",
            "outro": "You did it!!"
        }
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.add.bitmapText(this.center_width, this.center_height - 20, "wizardFont", messages[this.next], 40).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.playMusic();
        this.setText();
        this.showHistory();
        this.showPlayer();

        this.time.delayedCall(20000, () => this.loadNext(), null, this);
    }

    update () {
    }

    playMusic () {
        this.theme = this.sound.add("music4");
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

    loadNext () {
        this.theme.stop();
        this.scene.start(this.next, { name: this.name, number: 0 });
    }

    setText () {
        this.text = [ 
            "You are trapped in the temple of Bool",
            "Find your wait out through 7 rooms!",
            "You'll escape if you're lucky",
            "But you have to CREATE YOUR OWN LUCK!",
            "Jump when the dice has the number you need!",
            "Each die has unique properties.",
            "Stand on the die and jump again.",
            "Press enter to start!"
        ];
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this); 
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this); 
    }

    showPlayer() {
        this.player = this.add.sprite(this.center_width, 580, "wizard");
        this.add.image(this.center_width, 630, `d3`)
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

    showLine(text, y) {
        let line = this.add.bitmapText(this.center_width, y, "wizardFont", text, 25).setOrigin(0.5).setAlpha(0);
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }
}
