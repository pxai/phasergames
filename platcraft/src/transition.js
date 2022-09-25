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
        const messages = ["STAGE1", "STAGE 1", "STAGE 2", "STAGE 3", "STAGE 4" ];
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        if (this.number === 5) this.loadOutro();

        this.addScore();

        this.add.sprite(this.center_width, this.center_height - 170, "walt");
        this.add.bitmapText(this.center_width, this.center_height - 20, "pixelFont", messages[this.number], 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 20, "pixelFont", "Build phase", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.time.delayedCall(10000, () => { this.loadNext() }, null, this)
    }

    addScore() {
        this.scoreCoins = this.add.bitmapText(this.center_width + 32, this.center_height - 100, "pixelFont", "x" + this.registry.get("coins"), 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
        this.scoreCoinsLogo = this.add.sprite(this.center_width - 32, this.center_height - 100, "coin").setScale(0.7).setOrigin(0.5).setScrollFactor(0)
        const coinAnimation = this.anims.create({
          key: "coinscore",
          frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 7 }, ),
          frameRate: 8,
        });
        this.scoreCoinsLogo.play({ key: "coinscore", repeat: -1 });

        this.textInfo = this.add.bitmapText(this.center_width, this.center_height + 100, "pixelFont", "Calculating budget:", 45).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)

        this.text0 = this.add.bitmapText(this.center_width - 400, this.center_height + 200, "pixelFont", "0$", 40).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
        this.text1 = this.add.bitmapText(this.center_width + 400, this.center_height + 200, "pixelFont", "100$", 40).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
        this.coin = this.add.sprite(this.center_width, this.center_height+ 200, "coin").setScale(0.7).setOrigin(0.5).setScrollFactor(0)
        this.randomText = this.add.bitmapText(this.center_width, this.center_height + 300, "pixelFont", "", 50).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
        this.budget = 0;

        this.tweens.add({
            targets: [this.coin],
            x: {from: this.center_width - 350, to: this.center_width + 350},
            duration: 200,
            yoyo: true,
            repeat: 10,
            onRepeat: () => {
                this.budget = Phaser.Math.Between(20, 100);
                this.randomText.setText(this.budget + "$")
                console.log('Loop', this.budget);
            },
            onComplete: () => {
                this.showBudget();
            }
        })
    }

    showBudget () {
        this.coin.x = (this.budget * 800) / 100;
        this.updateCoins(this.budget)
        this.tweens.add({
            targets: [this.randomText],
            scale: {from: 1.2, to: 1},
            duration: 200,
            yoyo: true,
            repeat: 10,
            onComplete: () => {
                this.loadNext();
            }
        })
    }

    updateCoins (amount = 1) {
        const coins = +this.registry.get("coins") + amount;
        this.registry.set("coins", coins);
        this.scoreCoins.setText("x"+coins);
        this.tweens.add({
          targets: [this.scoreCoins, this.scoreCoinsLogo],
          scale: { from: 1.4, to: 1},
          duration: 50,
          repeat: 10
        })
      }

    update () {
    }

    loadNext () {
        this.scene.start("game_builder", { name: this.name, number: this.number  });
    }

    loadOutro () {
        this.scene.start("outro", { name: this.name, number: this.number });
    }
}
