import sounds from "./sounds";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        this.primaryColor = this.registry.get("primaryColor");
        this.secondaryColor = this.registry.get("secondaryColor");
        this.tertiaryColor = this.registry.get("tertiaryColor");
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.cameras.main.setBackgroundColor(this.secondaryColor - 0x2f2f2f);
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);
        this.addStartButton();
        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        // this.playMusic();
        // this.showPlayer();
        Array(5).fill().forEach(i => {
            this.sound.add(Phaser.Math.RND.pick(sounds)).play();
        })

        this.loadAudios();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("transition", { next: "game", name: "STAGE", number: 1, time: 30 });
    }

    showLogo () {
        this.gameLogo = this.add.bitmapText(this.center_width, 250, "doom", "NightmarE", 100).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7); ;

        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            x: {
                from: this.center_width * 2,
                to: this.center_width
            },
            y: {
                from: -200,
                to: 130
            }
        });
    }

    showPlayer () {

    }

    loadAudios () {
        this.audios = {};
        sounds.forEach(sound => {
            this.audios[sound] = this.sound.add(sound)
        });
    }

    playMusic (theme = "splash") {
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

    showInstructions () {
        this.add.bitmapText(this.center_width, 450, "doom", "WASD/Arrows: move", 30).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7); ;
        this.add.bitmapText(this.center_width, 500, "doom", "SPACE: track beam", 30).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7); ;
        this.add.bitmapText(this.center_width, 550, "doom", "B: shoot coins", 30).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7); ;
        this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.5).setTint(this.primaryColor);
        this.add.bitmapText(this.center_width + 40, 620, "doom", "By PELLO", 15).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7); ;
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: { from: 0, to: 1 },
            repeat: -1,
            yoyo: true
        });
    }

    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 670, "doom", "Click HERE to start", 30).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7);
        this.startButton.setInteractive();
        this.startButton.on("pointerdown", () => {
            this.startGame();
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
}
