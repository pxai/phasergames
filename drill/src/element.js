class Element extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "gold") {
        super(scene, x, y, name);
        this.setScale(2)
        this.name = name;
        this.scene = scene;
        this.id = Math.random();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.init();
   }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name),
            frameRate: 5,
            repeat: -1
          });

        this.scene.tweens.add({
            targets: [this],
            duration: 5000,
            y: {from: this.y - 10, to: this.y + 10},
            scale: { from: 0.8, to: 1},
            repeat: -1,
            yoyo: true,
        })

          this.anims.play(this.name, true)
    }

    update () {
    }

    destroy() {
        super.destroy();
    }
}

export default Element;
