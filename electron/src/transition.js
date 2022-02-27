export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.add.bitmapText(this.center_width, 200, "visitor", "Left click: ATRACT", 60).setOrigin(0.5)
        this.add.bitmapText(this.center_width, 100, "visitor", "Right click: REPEL", 60).setOrigin(0.5)
        this.add.sprite(this.center_width, 300, "particle0").setOrigin(0.5)
        this.add.bitmapText(this.center_width + 60, 300, "visitor", "-30", 30).setOrigin(0.5)
        this.add.sprite(this.center_width, 350, "particle1").setOrigin(0.5)
        this.add.bitmapText(this.center_width + 60, 350, "visitor", "+30", 30).setOrigin(0.5)
        this.add.sprite(this.center_width, 400, "particle2").setOrigin(0.5)
        this.add.bitmapText(this.center_width + 60, 400, "visitor", "-10", 30).setOrigin(0.5)
        this.coin = this.add.sprite(this.center_width, 450, "coin").setOrigin(0.5)
        const coinAnimation = this.anims.create({
            key: "coin2",
            frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 13 }, ),
            frameRate: 8,
          });
          this.coin.play({ key: "coin2", repeat: -1 });
        this.add.bitmapText(this.center_width + 60, 450, "visitor", "coins", 30).setOrigin(0.5)
        this.space = this.add.bitmapText(this.center_width, 550, "visitor", "CLICK HERE to start", 60).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });

        this.space.setInteractive();
        this.space.on('pointerdown', () => {
            this.startGame()
        })
    }

    addMouse (x, y, name) {
        const mouseIcon = this.add.sprite(x, y, "mouse").setScale(0.8);
        this.anims.create({
            key: name,
            frames: this.anims.generateFrameNumbers("mouse", { start: 0, end:1 }),
            frameRate: 3,
            repeat: -1
        });

        mouseIcon.anims.play(name, true);
    }

    update () {
    }

    addChangingLetter() {
        this.time.addEvent({ delay: 500, callback: () =>{             
            this.add.existing(new SingleLetter(this, this.center_width , this.center_height - 150, this.randomLetter()));
        }, callbackScope: this, loop: true });
        
    }

    addLetters () {
        const points = [4, 1, 1, 2, 1];
        "WORDS".split("").forEach((letter, i) => {
            this.add.existing(new SingleLetter(this, (this.center_width - 125 ) + 48 * (i + 1), this.center_height + 75, { letter, points: points[i]}));
        })
    }

    randomLetter () {
        const letters = LETTERS["en"];
        return letters[Phaser.Math.Between(0, letters.length - 1)];
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.game.sound.stopAll();

        this.sound.add("click").play();
        this.scene.start("game")
    }

}
