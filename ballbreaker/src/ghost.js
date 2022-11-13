class Ghost extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "ghost")
        this.setAlpha(0.3)
        scene.add.existing(this);
        scene.tweens.add({
            targets: [this],
            y: { from: this.y, to: this.y - 800},
            duration: 7000,
            onComplete: () => {
                this.destroy();
            }
        })

        this.init();
        scene.events.on("update", this.update, this);
    }

    init () {

        this.scene.anims.create({
          key: "ghost",
          frames: this.scene.anims.generateFrameNumbers("ghost", { start: 0, end: 2 }),
          frameRate: 5,
          repeat: -1
        });
    
        this.anims.play("ghost", true);
      }
}

export default Ghost;
