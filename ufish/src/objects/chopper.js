class Chopper extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, name = "chopper", scale = 0.5) {
        x = Phaser.Math.Between(0, 1) ? - 64 : scene.width + 64;
        y = y || Phaser.Math.Between(scene.height - 210, 32);

        super(scene, x, y, name);
        this.name = name;
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(scale);
        this.body.setAllowGravity(false);

        this.scene.add.existing(this);

        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "chopper",
            frames: this.scene.anims.generateFrameNumbers("chopper", { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
          });
  
          this.anims.play("chopper", true)
          this.body.setVelocityX(100)
    }


    update () {

    }
}

export default Chopper;
