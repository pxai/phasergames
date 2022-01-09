export default class Foe extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "foe0", velocity) {
        super(scene, x, y, "foe0")
        this.setScale(1.5)
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(true)

        this.body.setSize(62, 34)
        this.body.setOffset(0,30)
        this.init();
        this.flipX = (velocity > 0) 
        this.body.setVelocityX(velocity);
    }
    
    init () {
        this.scene.anims.create({
            key: "foe",
            frames: this.scene.anims.generateFrameNumbers("foe0", { start: 0, end:1 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.play("foe", true);
    }

    update() {
        if (this.body.touching.left || this.body.blocked.left) {
            this.body.setVelocityX(100)
            this.flipX = true;
        } else if (this.body.touching.right|| this.body.blocked.right) {
            this.body.setVelocityX(-100)
            this.flipX = false;
        }
    }
}