import { Steam }from "./steam";
export default class Player {
    constructor(scene, x, y) {
      this.scene = scene;
  
      // Create the physics-based sprite that we will move around and animate
      this.sprite = scene.matter.add.sprite(0, 0, "moriarty", 0);
  
      const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
      const { width: w, height: h } = this.sprite;
      const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, { chamfer: { radius: 10 } });
      mainBody.label = "player";
      this.direction = "down";
      this.sensors = {
       // top: Bodies.rectangle(2, h * 0.5, w * 0.25, -10, { isSensor: true, label: "playerTop" }),
        bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true, label: "playerBottom" }),
        left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true, label: "playerLeft" }),
        right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true, label: "playerRight" })
      };
      this.sensors.bottom.label = "player";

      const compoundBody = Body.create({
        parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
        frictionStatic: 0,
        frictionAir: 0.02,
        friction: 0.1,
        // The offset here allows us to control where the sprite is placed relative to the
        // matter body's x and y - here we want the sprite centered over the matter body.
        render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
      });
      this.sprite
        .setExistingBody(compoundBody)
        .setScale(0.7)
        .setFixedRotation() // Sets inertia to infinity so the player can't rotate
        .setPosition(x, y);
    
        this.isTouching = { left: false, right: false, ground: false };
        this.moveForce = 0.01;
        this.dead = false;
        this.destroyed = false;

        this.setSensors()
        this.init();
    }

    setSensors () {
        this.scene.matter.world.on("beforeupdate", this.resetTouching, this);

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

    init () {
        this.setKeys();

      this.scene.anims.create({
        key: "moriarty",
        frames: this.scene.anims.generateFrameNumbers("moriarty", { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
      });

      this.scene.anims.create({
        key: "death",
        frames: this.scene.anims.generateFrameNumbers("moriarty", { start: 2, end: 2 }),
        frameRate: 3,
        repeat: -1
      });
      this.sprite.anims.play("moriarty", true);
    }

    setKeys() {

        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.scene.events.on("update", this.update, this);
    }

    update () {
        if (this.destroyed || this.dead) return;
        if (Phaser.Input.Keyboard.JustDown(this.A)) {
            this.sprite.setFlipX(true);
            this.sprite.applyForce({ x: -this.moveForce, y: 0 });
          } else if (Phaser.Input.Keyboard.JustDown(this.D)) {
            this.sprite.setFlipX(false);
            this.sprite.applyForce({ x: this.moveForce, y: 0 });
          }
      
          // Limit horizontal speed, without this the player's velocity would just keep increasing to
          // absurd speeds. We don't want to touch the vertical velocity though, so that we don't
          // interfere with gravity.
          if (this.sprite.body.velocity.x > 7) this.sprite.setVelocityX(7);
          else if (this.sprite.body.velocity.x < -7) this.sprite.setVelocityX(-7);
      
          if (Phaser.Input.Keyboard.JustDown(this.W)) {
            this.scene.playRandom("player")
            Array(Phaser.Math.Between(5, 10)).fill(0).forEach(i => new Steam(this.scene, this.sprite.x, this.sprite.y))
            this.sprite.setVelocityY(-10);
          }
    }

    onSensorCollide({ bodyA, bodyB, pair }) {
        if (bodyB.isSensor) return; // We only care about collisions with physical objects
        // debugger
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

    death () {
        if (this.dead) return;
        this.dead = true;
        this.scene.time.delayedCall(1000, () => {
            if (this.direction === "down") {
              this.direction = "up";
              this.scene.cameras.main.startFollow(this.sprite, false, 0.5, 0.5, 0, 300);
            } else {
              this.direction = "down"
              this.scene.cameras.main.startFollow(this.sprite, false, 0.5, 0.5, 0, -300);
            }
            const { x, y } = this.scene.objectsLayer.objects.find( object => object.name === "player")
            this.sprite.x = x;
            this.sprite.y = y;
            this.scene.showStatus(this.direction, x, y)


            this.dead = false;
        }, null, this)
    }
  }