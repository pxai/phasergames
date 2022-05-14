
export default class DiamondBlock {
    constructor(scene, x, y) {
      this.scene = scene;
  
      // Create the physics-based sprite that we will move around and animate
      this.sprite = scene.matter.add.sprite(0, 0, "block_green", 0);
  
      const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
      const { width: w, height: h } = this.sprite;
     this.mainBody = Bodies.rectangle(0, 0, w, h);
      this.mainBody.label = "block";
      this.mainBody.collisionFilter = {
        'group': 1,
        'category': 2,
        'mask': 1,
      };

      this.sensors = {
        body: Bodies.rectangle(0, 0, w, h, { isSensor: true, label: "blockBody" }),
       };
       this.active = false;
      const compoundBody = Body.create({
        parts: [this.mainBody, this.sensors.body], //this.sensors.bottom, this.sensors.left, this.sensors.right, this.sensors.top],
        frictionAir: 0,
        friction: 0,
        frictionStatic: 0, 
        restitution: 1, // bounce = 1
        label: "player",
        ignoreGravity: true,
        isStatic: true
        // The offset here allows us to control where the sprite is placed relative to the
        // matter body's x and y - here we want the sprite centered over the matter body.
        //render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
      });


      this.sprite
        .setExistingBody(compoundBody)
        .setScale(1)
        .setFixedRotation() // Sets inertia to infinity so the player can't rotate
        .setPosition(x, y);

        this.setSensors()
        this.setListeners();
        this.setKeys();
        this.scene.events.on("update", this.update, this);
    }

    setKeys() {
      this.scene.events.on("update", this.update, this);
    }

  setListeners () {
    this.sprite.setInteractive();
    this.sprite.on("pointerdown", (pointer) => {
      this.sprite.rotation.set(0, Math.PI, -0.2)
      this.activate()
    });

    this.sprite.on("pointerover", () => {
      this.sprite.setTint(0x3E6875);
      this.sprite.setScale(1.1)
    });

    this.sprite.on("pointerout", () => {
        this.sprite.setScale(1)
        this.deactivate();
    });
  }

  activate () {
    this.active = true;
    this.scene.activeBlock = this;
  }

  deactivate () {
    this.active = false;
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

    update() {
      if (!this.active) return;
    }


    onSensorCollide({ bodyA, bodyB, pair }) {
        //if (!bodyB.label.startsWith("active")) return;
        
        if (bodyB.isSensor) {
          console.log("Its a : ", bodyB.label)
        } 

        console.log("Bounce!", bodyB)
      }
  }