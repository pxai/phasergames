export default class Block extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture = "block", frame = 0) {
        super(scene.matter.world, x, y, texture, 0);
        this.scene = scene;
        this.name = "block";
       // this.setPosition(x, y);

        this.init(x,y);
    }

  /*

  */
    init(x, y) {
        // this.scene.matter.world.on("beforeupdate", this.resetTouching, this);

        // Create the physics-based sprite that we will move around and animate

        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
        const { width: w, height: h } = this;
        const mainBody = Bodies.rectangle(0, 0, w , h);

        this.setExistingBody(mainBody).setPosition(x, y);
    }
}