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
        this.splashLayer = this.add.layer();
        this.text = [
            "The demonic hordes",
            "took over the moon base,",
            "then they jumped to earth,",
            "and sign up on Twitter",
            "But that is another story..."
        ];
        this.generateColors();
        this.showHistory();
        this.addStartButton();
        this.input.setDefaultCursor('default');
        // this.showPlayer();
        // this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }
    
    generateColors () {
        const primary = Phaser.Math.Between(0x010101, 0xfefefe);
        this.registry.set("primaryColor", primary);
        this.registry.set("secondaryColor", 0xffffff ^ primary); //~primary
        this.registry.set("tertiaryColor", 0x000000);
    }

    showHistory () {
        this.text.forEach((line, i) => {
            this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this);
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this);
    }

    playMusic (theme = "outro") {
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
        });
    }

    showLine (text, y) {
        const line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "doom", text, 35).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        });
    }

    startSplash () {
        // this.theme.stop();
        this.scene.start("splash");
    }

    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 670, "doom", "Click HERE to start", 30).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7);
        this.startButton.setInteractive();
        this.startButton.on("pointerdown", () => {
            this.startSplash();
        });

        this.startButton.on("pointerover", () => {
            this.startButton.setTint(0x3E6875);
        });

        this.startButton.on("pointerout", () => {
            this.startButton.setTint(0xffffff);
        });
        this.tweens.add({
            targets: this.startButton,
            duration: 300,
            alpha: { from: 0, to: 1 },
            repeat: -1,
            yoyo: true
        });
    }

    showPlayer() {
        this.player = this.add.sprite(this.center_width, this.height - 300, "doomguy").setScale(2).setOrigin(0.5);

    }
}
