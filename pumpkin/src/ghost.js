export default class Ghost extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, name);
        this.startX = x;
        this.startY = y;
        this.scene = scene;
        this.name = name;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.body.setSize(32,32);
        this.init();
    }

    init () {
        this.setOrigin(0.5);

        this.scene.anims.create({
            key: "pass" + this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.animate("pass");
    }

    update () {

    }

    animate (animation) {
        this.play(animation + this.name, true)
    }

    death() {
        console.log("Im dead ", this, this.name);
        this.dead = true;
        this.destroy();
    }
}
