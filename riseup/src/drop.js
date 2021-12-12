export default class Drop extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "drop");
        this.initialX = x;
        this.initialY = y;
        this.name = "drop";
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(true);
        this.scene.add.existing(this);
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 2 }),
            frameRate: 5,
            repeat: 0
          });

          this.scene.anims.create({
            key: this.name + "death",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 3, end: 5 }),
            frameRate: 5,
            repeat: 0
          });
  
          this.anims.play(this.name, true)

          this.on('animationcomplete', this.animationComplete, this);
    }


    update () {
    }

    death () {
      this.dead = true;
      this.body.enable = false;

      this.anims.play(this.name + "death")
    }

    animationComplete(animation, frame) {
      if (animation.key === this.name + "death") {
        this.destroy()
      }
    }

    turn () {}
}

