export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();        
        this.cameras.main.setBackgroundColor(0x3c97a6);
        this.splashLayer = this.add.layer();
        this.text = [ 
            "Finally",
            "our hero Andy Toad",
            "was able to escape",
            "from the puddles.",
            "He declared: croak",
            "croak, croak, ¡croak!",
            "¿Try again?"
        ];
        this.showCount();
        //this.showHistory();
        this.addStartButton()
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this); 
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this); 
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

    showPlayer () {
        this.add.sprite(this.center_width, 570, "block_blue").setOrigin(0.5).setScale(1.2);
    }

    showCount () {
        this.winText = this.add.bitmapText(this.center_width, -100, "mario", "TOTAL MOVES: " + this.registry.get("moves"), 30).setOrigin(0.5).setTint(0xfffd00).setDropShadow(2, 3, 0x75b947, 0.7);
        this.tweens.add({
          targets: this.winText,
          duration: 500,
          y: {from: this.winText.y, to: this.center_height}
        })
        this.tweens.add({
          targets: this.winText,
          duration: 100,
          scale: {from: 1, to: 1.1},
          repeat: -1,
          yoyo: true
        })
    }

    showLine(text, y) {
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "mario", text, 25).setOrigin(0.5).setAlpha(0).setTint(0xa6f316).setDropShadow(2, 3, 0x75b947, 0.7));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }

    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 500, "mario", "Click to start", 30).setOrigin(0.5).setTint(0x9A5000).setDropShadow(2, 3, 0x693600, 0.7);
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', () => {
            this.startSplash();
        });
    
        this.startButton.on('pointerover', () => {
            this.startButton.setTint(0x3E6875)
        });
    
        this.startButton.on('pointerout', () => {
            this.startButton.setTint(0xffffff)
        });
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }


    startSplash () {
        this.sound.stopAll();
        this.scene.start("splash");
    }
}
