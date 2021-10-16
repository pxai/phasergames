export default class Water {
    constructor(scene){
        this.scene = scene;
        this.water = this.scene.add.rectangle(0, this.scene.height - 200, this.scene.width, 200, 0x008080).setAlpha(0.5).setOrigin(0)


        this.surface = this.scene.add.rectangle(0, this.scene.height - 200, this.scene.width, 4, 0x008888).setAlpha(0.5).setOrigin(0)

        this.scene.physics.world.enable(this.surface);
        this.surface.body.immovable = true;
        this.surface.body.moves = false;
        this.waterLayer = this.scene.add.layer();
         this.generate();
    }

    generate () {
        this.shines = [];

        this.generationIntervalId = setInterval(() => this.add(this.scene), 100)
    }

    stop () {
        clearInterval(this.generationIntervalId);
        this.stopped = true;
        this.shines.forEach(shine => clearInterval(shine));
    }

    add (scene) {
        const x = Phaser.Math.Between(0, scene.width);
        const y = Phaser.Math.Between(scene.height - 196, scene.height)
        const shine = scene.add.rectangle(x, y, 10, 4, 0xffffff)
        this.waterLayer.add(shine);
        this.shines.push(setTimeout(() => shine.destroy(), 500))
    }

    update () {
    }
}