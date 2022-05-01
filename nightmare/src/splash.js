import sounds from "./sounds";
import { Particle } from "./particle";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        this.registry.set("ammo", 5);
        this.registry.set("health", 100);
        this.registry.set("armor", 0);
        this.registry.set("weapons", null);
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
        this.showTitle();

        this.time.delayedCall(1000, () => this.showInstructions(), null, this);
        this.addStartButton();
        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.playMusic();
        // this.showPlayer();
        Array(5).fill().forEach(i => {
            this.sound.add(Phaser.Math.RND.pick(sounds)).play({volume: 0.7});
        })

        this.showTitle();
        this.loadAudios();
    }


    showTitle() {
        "NightmarE".split("").forEach((letter, i) => {
            this.time.delayedCall(50 * (i+1) + 800,
                () => {
                    this.playAudioRandomly("gun")
                    Array(Phaser.Math.Between(20, 40)).fill(0).forEach((_j) => new Particle(this, 100 * (i+1), 150, this.primaryColor));

                    //if (Phaser.Math.Between(0, 5) > 2) this.playAudioRandomly("stone")
                    let text = this.add.bitmapText(100 * (i+1), 150, "doom", letter, 170).setTint(this.primaryColor).setOrigin(0.5).setDropShadow(4, 6, this.tertiaryColor, 0.9)
                 },
                null,
                this
            );
        })
    }

    playAudioRandomly(key) {
        const volume = Phaser.Math.Between(0.4, 0.7);
        const rate = 1; // Phaser.Math.Between(0.9, 1);
        this.sound.add(key).play({volume, rate});
      }

    startGame () {
        //if (this.theme) this.theme.stop();
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

    playMusic () {
        const theme = "music" + Phaser.Math.Between(0, 17);
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
    }

    showInstructions () {
        this.addReloadButton();
        this.blockFace = this.add.sprite(this.center_width, 280, "doomguy").setOrigin(0.5).setScale(1.2).setTint(this.primaryColor)

        //this.add.bitmapText(this.center_width, 450, "doomed", "Use the mouse", 30).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7); ;
        this.add.sprite(this.center_width - 60, 550, "pello").setOrigin(0.5).setScale(0.5).setTint(this.primaryColor);
        this.add.bitmapText(this.center_width + 40, 550, "doomed", "By PELLO", 15).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7); ;
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: { from: 0, to: 1 },
            repeat: -1,
            yoyo: true
        });
    }

    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 670, "doomed", "Click HERE to start", 40).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7);
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

    addReloadButton () {
        this.startButton = this.add.bitmapText(this.center_width, 400, "doomed", "Click to RELOAD COLORS", 40).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7);
        this.startButton.setInteractive();
        this.startButton.on("pointerdown", () => {
            this.scene.start("bootloader", { next: "game", name: "STAGE", number: 1, time: 30 });

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
