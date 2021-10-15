class Fish extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, name = "redfish", scale = 1) {
        x = Phaser.Math.Between(0, 1) ? - 128 : scene.width + 128;
        y = y || Phaser.Math.Between(scene.height - 32, scene.height - 200);

        scale = scale || Math.random() + 0.2;
        super(scene, x, y, name);
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(scale);
        this.scene.add.existing(this);

        this.init();
        this.moveIt(x);
    }

    init () {
        this.scene.anims.create({
            key: "swim",
            frames: this.scene.anims.generateFrameNumbers("redfish"),
            frameRate: 5,
            repeat: -1
          });
  
          this.anims.play("swim", true)
    }

    moveIt (x) {
        if (x < 0) {
            this.flipX = true;
            this.body.setVelocityX(Phaser.Math.Between(10, 30));
        } else {
            this.body.setVelocityX(Phaser.Math.Between(-10, -30));
        }
        
    }
}

export default Fish;
