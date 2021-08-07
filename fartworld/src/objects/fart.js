class Fart extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, scale = 0.8, color = null) {
        super(scene, x, y, "fart");
        this.scene = scene;
        scene.add.existing(this);

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

export default Fart;
