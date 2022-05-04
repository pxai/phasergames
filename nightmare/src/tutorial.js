import Card from "./card";
import { Empty, AmmoTile, WeaponTile, FoeTile, Health, Armor, Exit } from "./tile";


export default class Tutorial extends Phaser.Scene {
    constructor () {
        super({ key: "tutorial" });
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
            "Clear the rooms of monsters!",
            "or escape using an exit",
            "Get equiped before you engage.",
            "Picking empty tiles give ammo!!",
            "pick [1..7] better weapons against powerful foes",
            "or they will hit back"
        ];
        this.tiles = [
            [new FoeTile(0, 0, "grunt"), new FoeTile(0, 0, "imp"), new FoeTile(0, 0, "demon")],
            [new Exit(0, 0)],
            [new AmmoTile(0, 0), new Armor(0, 0), new WeaponTile(0, 0, "bfg"), new Health(0, 0),],
            [new Empty(0, 0)],
            [new WeaponTile(0, 0, "shotgun"), new WeaponTile(0, 0, "rocketlauncher"), new WeaponTile(0, 0, "bfg")],
            [new FoeTile(0, 0, "cacodemon"), new FoeTile(0, 0, "demon"),new FoeTile(0, 0, "mancubus")],
        ]
        this.sound.add("death").play();
        this.generateColors();
        this.showHistory();
        this.time.delayedCall(2000, () => { this.addStartButton()}, null, this);
        this.input.setDefaultCursor('default');
        this.tutorial = this.add.bitmapText(this.center_width, 32, "doomed", "QUICK TUTORIAL", 30).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7);

        // this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startGame, this);
        this.input.keyboard.on("keydown-ENTER", this.startGame, this);
    }
    
    generateColors () {
        const primary = Phaser.Math.Between(0x010101, 0xfefefe);
        this.registry.set("primaryColor", primary);
        this.registry.set("secondaryColor", 0xffffff ^ primary); //~primary
        this.registry.set("tertiaryColor", 0x000000);
    }

    showHistory () {
        this.text.forEach((line, i) => {
            this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, 64 + (64 * (2*i)), i), null, this);
        });
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

    showLine (text, y, i) {
        const line = this.introLayer.add(this.add.bitmapText(this.center_width - 190, y, "doomed", text, 20).setOrigin(0).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        });
        this.showCard(i)
    }

    startGame () {
        //if (this.theme) this.theme.stop();
        this.scene.start("transition", { next: "game", name: "STAGE", number: 1, time: 30 });
    }

    showCard(cardIndex) {
        this.tiles[cardIndex].forEach((tile, i)  => {
            let card = new Card(this, 64 + (64 * i), 64 + (64 * (2*cardIndex)), tile, 0, false)
            card.card.anims.play("flip", true);
            this.sound.add("flip").play()
        })

    }


    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 750, "doomed", "Click HERE to start", 30).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7);
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
