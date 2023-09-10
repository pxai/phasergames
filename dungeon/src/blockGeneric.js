export default class BlockGeneric {
    constructor(scene, x, y) {
        this.scene = scene;
        this.name = "block";
        this.init(x,y);
    }

    init(x, y) {
        // this.scene.matter.world.on("beforeupdate", this.resetTouching, this);

        // Create the physics-based sprite that we will move around and animate
        this.sprite = this.scene.matter.add.sprite(0, 0, this.name, 0);
        this.sprite.name = this.name;

        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
        const { width: w, height: h } = this.sprite;
        const mainBody = Bodies.rectangle(0, 0, w , h);

        this.sprite.setExistingBody(mainBody).setPosition(x, y);
    }
}