import Fireball from "./fireball";
import Bubble from "./bubble";
export default class Wizard extends Phaser.Physics.Matter.Sprite {
	constructor(scene, x, y, texture = "wizard", ground) {
		super(scene.matter.world, x, y, texture, 0)
        this.label = "wizard";
        this.scene = scene;
        this.scene.add.existing(this)
        this.body.position.y -= 10;
        this.startX = x
        this.direction = Phaser.Math.RND.pick([-1, 1]);

        this.setFixedRotation() 
        this.addCollisions();
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.label,
            frames: this.scene.anims.generateFrameNumbers(this.label, { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1
          });
  
          this.anims.play(this.label, true)

          //this.flipX = this.direction > 0;
          this.on('animationcomplete', this.animationComplete, this);
          this.setVelocityX(this.direction * 2)
          console.log(this)
          this.scene.events.on("update", this.update, this);
          this.timer = this.scene.time.addEvent({ delay: 3000, callback: this.directShot, callbackScope: this, loop: true });

    }

    addCollisions () {
      this.unsubscribeBatCollide = this.scene.matterCollision.addOnCollideStart({
        objectA: this,
        callback: this.onWizardCollide,
        context: this
      });
    }

    onWizardCollide({ gameObjectA, gameObjectB }) {
      if (gameObjectB instanceof Bubble) {
        console.log("Wizard collide: ", gameObjectA, gameObjectB)
        gameObjectB.load("wizard")
        this.destroy();
      }
    }

    directShot() {
      const distance = Phaser.Math.Distance.BetweenPoints(this.scene.player, this);
      this.anims.play("wizardshot", true)
      const fireball = new Fireball(this.scene, this.x, this.y, this.direction)
      this.delayedTurn = this.scene.time.delayedCall(1000, () => { this.turn();}, null, this);
      //this.scene.arrows.add(fireball)
      //this.scene.physics.moveTo(fireball, this.scene.player.x, this.scene.player.y, 100);
    }


    update () {
      if (!this.active) return;
      //if (Math.abs(this.body.velocity.x) <= 0.2) this.turn()
    }

    turn () {
        this.direction = -this.direction;
        this.flipX = this.direction > 0;
        this.setFlipX(this.direction > 0);
        this.setVelocityX(this.direction * 5)
    }

    death () {
      this.destroy();
    }

    animationComplete(animation, frame) {
        if (animation.key === this.label + "death") {
          this.destroy()
        }
    }

    destroy () {
      if (this.timer) this.timer.destroy();
      if (this.delayedTurn) this.delayedTurn.destroy();
      if (this.fireball) this.fireball.destroy();
      super.destroy();
    }
}

