class FartAttack extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, scale = 0.8, right, color = 0xffdd00) {
        super(scene, x, y, "fart");
        this.right = right;
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.velocity.x = 100 * -this.right;

        this.setOrigin(0.5)

        const fartAnimation = this.scene.anims.create({
            key: "jumpFart",
            frames: this.scene.anims.generateFrameNumbers("fart"),
            frameRate: 20
        });

        this.setScale(scale);
        if (color) { this.tint = color }
  
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            this.destroy();
        }, this);
       
        this.play({ key: "jumpFart"});
    }
}

export default FartAttack;
