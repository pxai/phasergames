export default class Player {
    constructor(scene, x, y) {
      this.scene = scene;
  
      // Create the physics-based sprite that we will move around and animate
      this.sprite = scene.matter.add.sprite(0, 0, "spider", 0);
  
      const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
      const { width: w, height: h } = this.sprite;
      this.mainBody = Bodies.circle(0, 0, 10);
      this.mainBody.label = "player";
      /*this.mainBody.collisionFilter = {
        'group': 1,
        'category': 2,
        'mask': 1,
      };*/
      this.direction = "down";
      this.sensors = {
        body: Bodies.circle(0, 0, 10, { isSensor: true, label: "playerBody" }),
       };

      const compoundBody = Body.create({
        parts: [this.mainBody, this.sensors.body], //this.sensors.bottom, this.sensors.left, this.sensors.right, this.sensors.top],
        frictionStatic: 0,
        frictionAir: 0,
        friction: 0,
        restitution: 1, // bounce = 1
        label: "player",
        ignoreGravity: true
        // The offset here allows us to control where the sprite is placed relative to the
        // matter body's x and y - here we want the sprite centered over the matter body.
        //render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
      });

      this.moveForce = 0.01;
      this.sprite
        .setExistingBody(compoundBody)
        .setScale(0.7)
        .setFixedRotation() // Sets inertia to infinity so the player can't rotate
        .setPosition(x, y);
    
        this.moveForce = 0.01;
        this.dead = false;
        this.destroyed = false;

        this.setSensors()
        this.sprite.setVelocity(0, 5);
        this.init();
    }

    setSensors () {
       // this.scene.matter.world.on("beforeupdate", this.resetTouching, this);

        // If a sensor just started colliding with something, or it continues to collide with something,
        // call onSensorCollide
        this.scene.matterCollision.addOnCollideStart({
          objectA: [this.sensors.body],
          callback: this.onSensorCollide,
          context: this
        });
        this.scene.matterCollision.addOnCollideActive({
          objectA: [this.sensors.body],
          callback: this.onSensorCollide,
          context: this
        });
    }

    init () {
        this.setKeys();

      this.scene.anims.create({
        key: "spideridle",
        frames: this.scene.anims.generateFrameNumbers("spider", { start: 0, end: 2 }),
        frameRate: 3,
        repeat: -1
      });

     /* this.scene.anims.create({
        key: "death",
        frames: this.scene.anims.generateFrameNumbers("moriarty", { start: 2, end: 2 }),
        frameRate: 3,
        repeat: -1
      });*/
      this.sprite.anims.play("spideridle", true);
    }

    setKeys() {

        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.SPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.scene.events.on("update", this.update, this);
    }

    update () {
     
          // Limit horizontal speed, without this the player's velocity would just keep increasing to
          // absurd speeds. We don't want to touch the vertical velocity though, so that we don't
          // interfere with gravity.
         /* if (this.sprite.body.velocity.y > 7) this.sprite.setVelocityY(7);
          if (this.sprite.body.velocity.x > 7) this.sprite.setVelocityX(7);
          else if (this.sprite.body.velocity.x < -7) this.sprite.setVelocityX(-7);
        */
      
          if (this.scene.pointer.isDown) {
            console.log("Mouse down")
            if (this.scene.pointer.rightButtonDown()) {
                console.log("Right clicky")
            } else {
                // left
            }
    
          }
    }

    onSensorCollide({ bodyA, bodyB, pair }) {
        //if (!bodyB.label.startsWith("active")) return;
        
        if (bodyB.isSensor) {
          console.log("Its a : ", bodyB.label)
        } 

        console.log("Bounce!", bodyB)
      }


      addSpring(body) {
        this.spring = this.scene.matter.add.spring(this.sprite, body, 15, 0.01);
        console.log("Lets see: ", this.spring)
       // this.scene.time.delayedCall(2000, () => { this.spring = null}, null, this);
      }

    death () {
        this.dead = true;
    }
  }