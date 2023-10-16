
export default class Bat extends Phaser.Physics.Matter.Sprite {
	constructor(scene, x, y, texture = "bat", ground) {
		super(scene.matter.world, x, y, texture, 0)
        this.label = "bat";
        this.scene = scene;
        this.scene.add.existing(this)
        this.startX = x
        this.direction = -1 //Phaser.Math.RND.pick([-1, 1]);
        this.setFixedRotation()
        this.setIgnoreGravity(true)
        this.addCollisions();
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.label,
            frames: this.scene.anims.generateFrameNumbers(this.label, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
          });

          this.scene.anims.create({
            key: this.label + "death",
            frames: this.scene.anims.generateFrameNumbers(this.label, { start: 2, end: 5 }),
            frameRate: 5,
          });

          this.anims.play(this.label, true)
          //this.body.setVelocityX(this.direction * 150);
          //this.flipX = this.direction > 0;
          this.on('animationcomplete', this.animationComplete, this);
          this.setVelocityX(this.direction * 5)
          this.scene.events.on("update", this.update, this);

    }

    addCollisions () {
      this.unsubscribeBatCollide = this.scene.matterCollision.addOnCollideStart({
        objectA: this,
        callback: this.onBatCollide,
        context: this
      });
    }

    onBatCollide({ gameObjectA, gameObjectB }) {
    }


    update () {
      if (!this.active) return;
      if (Math.abs(this.body.velocity.x) <= 0.5) this.turn()
    }

    turn () {
        this.direction = -this.direction;
        this.flipX = this.direction > 0;
        this.setFlipX(this.direction > 0);
        this.setVelocityX(this.direction * 5)
        //this.body.setVelocityX(this.direction * 150);
    }

    death () {
        this.dead = true;
        this.anims.play(this.label + "death")
      }

      animationComplete(animation, frame) {
        if (animation.key === this.label + "death") {
          this.destroy()
        }
    }
}

