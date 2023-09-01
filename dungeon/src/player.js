
export default class Player {
    constructor (scene, x, y) {
        this.scene = scene;
        this.init(x,y);
        this.moveForce = 0.01;
        this.addControls();
    }

    init (x,y) {

        this.isTouching = { left: false, right: false, ground: false };

        // Jumping is going to have a cooldown
        this.canJump = true;
        this.jumpCooldownTimer = null;
    
        // Before matter's update, reset our record of what surfaces the player is touching.
        this.scene.matter.world.on("beforeupdate", this.resetTouching, this);

            // Create the physics-based sprite that we will move around and animate
        this.sprite = this.scene.matter.add.sprite(0, 0, "player", 0);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
        const { width: w, height: h } = this.sprite;
        const mainBody = Bodies.rectangle(0, 0, w , h, { chamfer: { radius: 10 } });
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
        this.sprite.setExistingBody(compoundBody).setScale(1)
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
    }

    onSensorCollide({ bodyA, bodyB, pair }) {
        if (bodyB.isSensor) return; // We only care about collisions with physical objects
        if (bodyA === this.sensors.left) {
          this.isTouching.left = true;
          if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
        } else if (bodyA === this.sensors.right) {
          this.isTouching.right = true;
          if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
        } else if (bodyA === this.sensors.bottom) {
          this.isTouching.ground = true;
        }
      }
    
      resetTouching() {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.ground = false;
      }

    addControls() {
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); 

    }

    update(time, delta) {
        const isOnGround = this.isTouching.ground;
        const isInAir = !isOnGround;
        this.moveForce = isOnGround ? 0.01 : 0.005;

        if (this.D.isDown || this.cursor.right.isDown) {
            this.sprite.setFlipX(false);
            if (!(isInAir && this.isTouching.right)) {
                this.sprite.applyForce({ x: this.moveForce, y: 0 });
            }
        } else if (this.A.isDown || this.cursor.left.isDown) {
            this.sprite.setFlipX(true);
            if (!(isInAir && this.isTouching.left)) {
                this.sprite.applyForce({ x: -this.moveForce, y: 0 });
            }
        }

        if (this.sprite.body.velocity.x > 7) this.sprite.setVelocityX(7);
        else if (this.sprite.body.velocity.x < -7) this.sprite.setVelocityX(-7);

        if (this.canJump && isOnGround && (this.W.isDown || this.cursor.up.isDown))  {            
            this.sprite.setVelocityY(-11);

            // Add a slight delay between jumps since the bottom sensor will still collide for a few
            // frames after a jump is initiated
            this.canJump = false;
            this.jumpCooldownTimer = this.scene.time.addEvent({
              delay: 250,
              callback: () => (this.canJump = true)
            });
        }
    }

    destroy() {
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

    step (x, y) {

    }

    land (x, y) {

    }

}