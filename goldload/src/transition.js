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
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.add.bitmapText(this.center_width, 100, "pixelFont", "STAGE" + (this.number + 1), 40).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7)
        this.add.bitmapText(this.center_width, 150, "pixelFont", "Ready?", 30).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7)
        this.add.bitmapText(this.center_width, this.height - 400, "pixelFont", "Total Gold: " + this.registry.get("totalGolds"), 30).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7)
        this.add.bitmapText(this.center_width, this.height - 100, "pixelFont", "Click to Start", 30).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7)
 
        this.addScenario();
        //this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        //this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.input.on('pointerdown', (pointer) => this.loadNext(), this);
        this.time.delayedCall(15000, () => { this.loadNext()}, null, this)
    }

    addScenario() {
        let positions = [
            {x: 300, y: 300}, {x: 450, y: 300}, {x: 600, y: 300}, {x: 750, y: 300},
        ]
        
        this.lines = this.add.layer();
        positions.forEach((position, i) => {
            const {x, y} = position;
            const index = this.number > i ? 1 : 0;
            this.add.bitmapText(x, y - 32, "pixelFont", "Stage " + (i+1), 10).setOrigin(0.5).setDropShadow(0, 3, 0x222222, 0.9);
            this.add.sprite(x, y, "water_volcano", index).setScale(1.2)
            if (i < 3) {
                this.lines.add(this.add.rectangle(x, y, 160, 10, 0x0eb7b7).setOrigin(0, 0.5))  
            }
          
        })

        const character = this.add.sprite(300, 300, "gold0").setOrigin(0.5)


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
        this.game.sound.stopAll();
        this.scene.start("game", { name: this.name, number: this.number });
    }
}
