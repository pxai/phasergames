export default class Water {
    constructor(scene){
        this.scene = scene;
        this.water = this.scene.add.rectangle(0, this.scene.initial.y + 600, this.scene.width, 800, 0x008080).setAlpha(0.5).setOrigin(0).setScrollFactor(0, 1)
        this.surface = this.scene.add.rectangle(0, this.scene.initial.y + 600, this.scene.width * 100, 4, 0x008888).setAlpha(0.5).setOrigin(0).setScrollFactor(0, 1)

        this.scene.physics.world.enable(this.surface);
        this.surface.body.immovable = true;
        this.surface.body.moves = false;
        this.waterLayer = this.scene.add.layer();
        this.generate();
    }

    generate () {
        console.log("WATER CREATED-------------------")
        this.shines = [];
        this.generationIntervalId = setInterval(() => this.add(this.scene), 100)
    }

    stop () {
        clearInterval(this.generationIntervalId);
        this.stopped = true;
        this.shines.forEach(shine => clearInterval(shine));
    }

    add (scene) {
        if (!scene) return;
        const x = Phaser.Math.Between(this.scene.crab.x - 500, this.scene.crab.x + 500);
        const y = Phaser.Math.Between(this.surface.y + 2, this.surface.y + 200)
        const shine = scene.add.rectangle(x, y, 10, 4, 0xffffff)
        this.waterLayer.add(shine);
        this.shines.push(setTimeout(() => shine.destroy(), 500))
    }

    update () {
    }
}