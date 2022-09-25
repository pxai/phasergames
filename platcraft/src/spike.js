
class Spike extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, type = 0) {
        super(scene, x , y, "spike")
        this.scene = scene;
        this.name = "spike";
        this.type = type;
        this.setOrigin(0.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.immovable = true;
        this.body.moves = false;

        this.resetPosition()
        this.init();
    }

    resetPosition () {
        if (this.type === 0) {
            this.x += 16;
            this.y += 16;
        }

        if (this.type === 1) {
            this.angle = 90;
            this.x -= 16;
            this.y -= 16;
        }

        if (this.type === 2) {
            this.angle = 180;
            this.x -= 16;
            this.y -= 16;
        }

        if (this.type === 3) {
            this.angle =-90;
            this.x += 16;
            this.y += 16;
        }
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames:  this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

       // this.anims.play(this.name, true);
    }
}

export default Spike;
