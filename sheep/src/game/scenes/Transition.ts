import { Scene } from 'phaser';



export default class Transition extends Scene {
    private width: number;
    private height: number;
    private center_width: number;
    private center_height: number;
    private name: string;
    private number: number;
    private seconds: number;

    constructor() {
        super("Transition");
    }

    init(data: any) {
        this.name = data.name;
        this.number = data.number || 0;
        this.seconds = data.seconds || 30;
    }

    preload() {
        if (this.number === 9) {
            this.scene.start("Outro");
        }
    }

    create() {
        this.width = Number(this.sys.game.config.width);
        this.height = Number(this.sys.game.config.height);
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x000000) //0xfef1ca
        this.add.bitmapText(this.center_width, this.center_height - 40, "default", "Stage " + (this.number + 1) + "/9", 60).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 40, "default", "Ready?", 40).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.time.delayedCall(2000, () => { this.loadNext(); }, null, this)
        this.input.on('pointerdown', () => this.loadNext(), this);
        this.addScanlines();
    }

    update() {
    }


    addScanlines() {
        for (let y = 0; y < this.height; y += 4) {
            let line = this.add.rectangle(this.center_width, y, this.width, 2, 0x000000)
            line.alpha = 1;
            line.depth = 1000;
        }
    }


    loadNext() {
        this.scene.start("Game", { name: this.name, number: this.number, seconds: 30 + (this.number * 10) });
    }
}
