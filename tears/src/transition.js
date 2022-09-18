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
        const messages = ["TUTORIAL", "STAGE 1", "STAGE 2", "STAGE 3", "STAGE 4" ];
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        if (this.number === 5) this.loadOutro();

        //this.add.sprite(this.center_width, this.center_height - 170, "walt");
        //this.add.bitmapText(this.center_width, this.center_height - 20, "type", messages[this.number], 40).setOrigin(0.5)
        //this.add.bitmapText(this.center_width, this.center_height + 20, "type", "Ready?", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.time.delayedCall(20000, () => { this.loadNext() }, null, this)
        this.showText();
    }

    addScore() {
        this.scoreGun = this.add.bitmapText(this.center_width + 32, this.center_height - 100, "type", "x" + this.registry.get("gun"), 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
        this.scoreGunLogo = this.add.sprite(this.center_width - 32, this.center_height - 100, "coin").setScale(0.7).setOrigin(0.5).setScrollFactor(0)
        const coinAnimation = this.anims.create({
          key: "guncore",
          frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 7 }, ),
          frameRate: 8,
        });
        this.scoreGunLogo.play({ key: "guncore", repeat: -1 });
      }

    update () {
    }

    loadNext () {
        if (this.theme) this.theme.stop();
        if (this.number === 0)
            this.game.sound.stopAll();
        this.scene.start("game", { name: this.name, number: this.number  });
    }

    playAudioRandomly(key) {
        const volume = Phaser.Math.Between(0.8, 1);
        const rate = 1; // Phaser.Math.Between(0.9, 1);
        this.sound.add(key).play({volume, rate});
      }

    showText() {
        const texts = [
            "It is the year 2079.\nAll replicants were retired,\n but Tyrell Corporation\nhad other plans...\nAgent Dickhard was called again\nThis time equiped with\n an advanced keyboard.\nUse it to create matter around\nyou and move forward!",
            "transition1",
            "transition2",
            "transition3",
            "transition4",
            
        ];
        this.characters = [];
        let jump = 0;
        let line = 0;
        texts[this.number].split("").forEach( (character, i) => {                    
            if (character === "\n") { jump++; line = 0 }
            this.characters.push(this.add.bitmapText(this.center_width - 350 + (line++ * 25), 150 + (jump * 30), "type", character, 32).setAlpha(0))
        })
        const timeline = this.tweens.createTimeline();
        this.characters.forEach( (character, i) => {
            timeline.add({
                targets: character,
                alpha: { from: 0, to: 0.5},
                duration: 100,
                onComplete: () => {
                    this.playAudioRandomly("type")
                }
            })
        })

        timeline.play();
        this.space = this.add.bitmapText(this.center_width, 670, "type", "SPACE/ENTER to SKIP", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
    
    fadeToBlack () {
        this.fade = this.add.rectangle(0, 0, 2000, 2600, 0x000000).setAlpha(0)
        this.tweens.add({
            targets: this.fade,
            alpha: { from: 0, to: 1},
            duration: 3000,
            onComplete: () => {
                this.loadNext()
            }
        })
    }

    loadOutro () {
        this.scene.start("outro", { name: this.name, number: this.number });
    }
}
