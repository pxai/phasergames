export default class Water {
    constructor(scene){
        this.scene = scene;
        this.water = this.scene.add.rectangle(0, this.scene.seaInitial.y + 600, this.scene.width, 800, 0x008080).setAlpha(0.5).setOrigin(0).setScrollFactor(0, 1)
        this.surface = this.scene.add.rectangle(0, this.scene.seaInitial.y + 600, this.scene.width * 100, 4, 0x008888).setAlpha(0.5).setOrigin(0).setScrollFactor(0, 1)

        this.scene.physics.world.enable(this.surface);
        this.surface.body.immovable = true;
        this.surface.body.moves = false;
        this.generate();
    }

    generate () {
        this.shines = [];
        this.generationIntervalId = setInterval(() => this.add(), 100)
    }

    stop () {
        clearInterval(this.generationIntervalId);
        this.stopped = true;
    }

    add () {
        const x = Phaser.Math.Between(this.scene.crab.x - 500, this.scene.crab.x + 500);
        const y = Phaser.Math.Between(this.surface.y + 2, this.surface.y + 200)
        const shine = this.scene.add.rectangle(x, y, 10, 4, 0xffffff)
        this.scene.tweens.add({
            targets: shine,
            duration: 600,
            alpha: {from: 1, to: 0},
            onComplete: () => {
                shine.destroy()
            }
        });
     }

    update () {
    }
}