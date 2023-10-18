import Bubble from "./bubble";
import Dust from "./particle";

export default class Player {
    constructor (scene, x, y) {
        this.scene = scene;
        this.label = "player";
        this.init(x,y);
        this.moveForce = 0.01;
        this.addControls();
        this.invincible = true;
    }

  /*

  */
    init (x,y) {
        this.isTouching = { left: false, right: false, ground: false };

        // Jumping is going to have a cooldown
        this.canJump = true;
        this.jumpCooldownTimer = null;
        this.canShoot = true;
        this.shootCooldownTimer = null;

        this.onWall = false;
        // Before matter's update, reset our record of what surfaces the player is touching.
        this.scene.matter.world.on("beforeupdate", this.resetTouching, this);

            // Create the physics-based sprite that we will move around and animate
        this.sprite = this.scene.matter.add.sprite(0, 0, "player", 0);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
        const { width: w, height: h } = this.sprite;

        const mainBody = Bodies.rectangle(0, 5, w - 14 , h - 10, { chamfer: { radius: 10 } });
        this.sensors = {
            bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
            left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
            right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true })
        };
        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.1,
            // The offset here allows us to control where the sprite is placed relative to the
            // matter body's x and y - here we want the sprite centered over the matter body.
            render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
        });
        this.sprite.setExistingBody(compoundBody)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setPosition(x, y);
        this.scene.events.on("update", this.update, this);
        this.scene.events.once("shutdown", this.destroy, this);
        this.scene.events.once("destroy", this.destroy, this);

        // If a sensor just started colliding with something, or it continues to collide with something,
        // call onSensorCollide
        this.scene.matterCollision.addOnCollideStart({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
        this.scene.matterCollision.addOnCollideActive({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });

        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers(this.label, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
          });

          this.scene.anims.create({
            key: "playerwalk",
            frames: this.scene.anims.generateFrameNumbers(this.label, { start: 0, end: 3 }),
            frameRate: 6,
          });

          this.scene.anims.create({
            key: "playershot",
            frames: this.scene.anims.generateFrameNumbers(this.label, { start: 4, end: 5 }),
            frameRate: 4,
          });
          this.sprite.anims.play("playeridle", true)
          this.sprite.on('animationcomplete', this.animationComplete, this);
          this.scene.tweens.add({
            targets: this.sprite,
            alpha: {from: .5, to: 1},
            duration: 200,
            repeat: 10,
            onComplete: () => {
                this.invincible = false;
            }
        })
    }

  /*

  */
    onSensorCollide({ bodyA, bodyB, pair }) {
        if (bodyB.isSensor) return; // We only care about collisions with physical objects
        if (bodyA === this.sensors.left) {
            this.friction();
            this.onWall = true;
          this.isTouching.left = true;
          if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
        } else if (bodyA === this.sensors.right) {
          this.friction();
          this.onWall = true;
          this.isTouching.right = true;
          if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
        } else if (bodyA === this.sensors.bottom) {
            this.land()
          this.isTouching.ground = true;
        }
      }

  /*

  */
      resetTouching() {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.ground = false;
      }

  /*

  */
    addControls() {
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

  /*

  */
    update(time, delta) {
        const isOnGround = this.isTouching.ground;
        const isInAir = !isOnGround;
        this.moveForce = isOnGround ? 0.01 : 0.005;

        if (this.D.isDown || this.cursor.right.isDown) {
            this.sprite.setFlipX(true);
            if (!(isInAir && this.isTouching.right)) {
                this.step();
                this.sprite.anims.play("playerwalk", true)
                this.sprite.setVelocityX(5)
            }
        } else if (this.A.isDown || this.cursor.left.isDown) {
            this.sprite.setFlipX(false);
            if (!(isInAir && this.isTouching.left)) {
                this.step();
                this.sprite.anims.play("playerwalk", true)
                this.sprite.setVelocityX(-5)
            }
        } else {
            if (this.sprite.anims.currentAnim.key !== 'playershot')
                this.sprite.anims.play("playeridle", true)
        }

        if (this.sprite.body.velocity.x > 7) this.sprite.setVelocityX(7);
        else if (this.sprite.body.velocity.x < -7) this.sprite.setVelocityX(-7);

        if (((this.canJump && isOnGround) || this.onWall) && (this.W.isDown || this.cursor.up.isDown))  {
        //if (((this.canJump && isOnGround) || (this.isTouching.left) || (this.isTouching.right)) && (this.W.isDown || this.cursor.up.isDown))  {
            this.sprite.setVelocityY(-8);
            // Add a slight delay between jumps since the bottom sensor will still collide for a few
            // frames after a jump is initiated
            this.scene.playAudio("jump")
            this.canJump = false;
            this.onWall = false;
            this.jumpCooldownTimer = this.scene.time.addEvent({
              delay: 250,
              callback: () => (this.canJump = true)
            });
        }

        if (this.canShoot && (Phaser.Input.Keyboard.JustDown(this.cursor.down) || Phaser.Input.Keyboard.JustDown(this.W))) {
            const offset = this.sprite.flipX ? 128 : -128;
            this.sprite.anims.play("playershot", true)
            this.scene.playAudio("bubble")
            this.canShoot = false;
            new Bubble(this.scene, this.sprite.x, this.sprite.y, offset)
            this.shootCooldownTimer = this.scene.time.addEvent({
                delay: 500,
                callback: () => (this.canShoot = true)
              });
        }

    }

  /*

  */
    destroy() {
        this.scene.playAudio("death")
        this.destroyed = true;

        // Event listeners
        this.scene.events.off("update", this.update, this);
        this.scene.events.off("shutdown", this.destroy, this);
        this.scene.events.off("destroy", this.destroy, this);
        if (this.scene.matter.world) {
          this.scene.matter.world.off("beforeupdate", this.resetTouching, this);
        }

        // Matter collision plugin
        const sensors = [this.sensors.bottom, this.sensors.left, this.sensors.right];
        this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
        this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });

        // Don't want any timers triggering post-mortem
        if (this.jumpCooldownTimer) this.jumpCooldownTimer.destroy();

        this.sprite.destroy();
      }

  /*

  */
    step () {
        if (Phaser.Math.Between(0, 5) > 4) {
            this.scene.trailLayer.add(new Dust(this.scene, this.sprite.x, this.sprite.y + Phaser.Math.Between(10, 16)))
        }
    }

  /*

  */
    friction () {
        console.log("Friction!!")
        Array(Phaser.Math.Between(2, 4)).fill(0).forEach(i => {
            new Dust(this.scene, this.sprite.x + Phaser.Math.Between(-8, 8), this.sprite.y + Phaser.Math.Between(-32, 32))
        })
    }

  /*

  */
    land () {
       if (this.sprite.body.velocity.y < 1) return;
       console.log("LAND", this.sprite.body.velocity.y)
       Array(Phaser.Math.Between(3, 6)).fill(0).forEach(i => {
            new Dust(this.scene, this.sprite.x + Phaser.Math.Between(-32, 32), this.sprite.y + Phaser.Math.Between(10, 16))
       })
    }

  /*

  */
    explosion () {
        Array(Phaser.Math.Between(10, 15)).fill(0).forEach(i => {
             new Dust(this.scene, this.sprite.x + Phaser.Math.Between(-32, 32), this.sprite.y + Phaser.Math.Between(10, 16))
        })
     }

  /*

  */
    animationComplete (animation, frame) {
        if (animation.key === "playershot") {
            this.sprite.anims.play("playeridle", true)
          }
    }
}