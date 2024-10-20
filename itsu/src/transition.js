export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.number = data.number;
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.add.bitmapText(this.center_width, this.center_height - 20, "pixelFont", this.number, 60).setOrigin(0.5).setTint(0xf6ae2d)
        this.add.bitmapText(this.center_width, this.center_height + 20, "pixelFont", "Prest?", 50).setOrigin(0.5).setTint(0xf6ae2d)


        if (this.number === 9) {
            this.scene.start("outro", { number: this.number });
            return
        }

        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);



        this.time.delayedCall(2000, () => this.loadNext(), null, this);

       this.addScenario();

    }

    addScenario() {
        let positions = [
            {x: 50, y: 300}, {x: 150, y: 300}, {x: 250, y: 300},
            {x: 350, y: 300}, {x: 450, y: 300}, {x: 550, y: 300},
            {x: 650, y: 300}, {x: 750, y: 300}, {x: 850, y: 300},
        ]

        this.lines = this.add.layer();
        positions.forEach((position, i) => {
            const {x, y} = position;
            const index = this.number > i ? 1 : 0;
            this.add.bitmapText(x, y - 32, "pixelFont", "" + (i+1), 30).setOrigin(0.5).setTint(0xf6ae2d).setDropShadow(0, 3, 0x222222, 0.9);
            this.add.sprite(x, y, "brick", index).setScale(0.5)
            if (i < 8) {
                this.lines.add(this.add.rectangle(x, y, 110, 10, 0xf6ae2d).setOrigin(0, 0.5)).setScale(1)
            }

        })

        const character = this.add.sprite(positions[0].x, positions[0].y, "walt").setOrigin(0.5)


        if (this.number > 0) {
            const origin = positions[this.number -1 ]
            const destiny = positions[this.number]
            this.tweens.add({
                targets: character,
                x: {from: origin.x, to: destiny.x},
                y: {from: origin.y, to: destiny.y},
                duration: 1000,
                onComplete: () => {
                    this.tweens.add({
                        targets: character,
                        scaleX: {from: 0.9, to: 1},
                        y: "-=5",
                        yoyo: true,
                        duration: 200,
                        repeat: -1
                    })
                }
            })
        }
    }

    update () {
    }

    loadNext () {
        this.scene.start("game", { number: this.number });
    }
}
