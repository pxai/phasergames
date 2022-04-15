export default class Skeleton extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, "skeleton")
        this.name = name;
        this.scene = scene;
        scene.add.existing(this)
        scene.physics.add.existing(this);

        this.body.setSize(32, 32)
        this.setOrigin(0.5)
      
        this.body.setImmovable(true)
        this.body.setAllowGravity(false);
        this.init();
    }
  
    init () {
      this.scene.anims.create({
        key: "skeleton0",
        frames: this.scene.anims.generateFrameNumbers("skeleton", { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1
      });
    
      this.scene.anims.create({
        key: "skeleton1",
        frames: this.scene.anims.generateFrameNumbers("skeleton", { start: 2, end: 3 }),
        frameRate: 5,
        repeat: -1
      });
  
      this.scene.anims.create({
        key: "skeleton2",
        frames: this.scene.anims.generateFrameNumbers("skeleton", { start: 4, end: 5 }),
        frameRate: 5,
        repeat: -1
      });
    
      this.scene.anims.create({
        key: "skeleton3",
        frames: this.scene.anims.generateFrameNumbers("skeleton", { start: 6, end: 7 }),
        frameRate: 5,
        repeat: -1
      });

      this.scene.anims.create({
        key: "skeletondeath",
        frames: this.scene.anims.generateFrameNumbers("skeleton", { start: 8, end: 10 }),
        frameRate: 5,
      });
      this.on('animationcomplete', this.animationComplete, this);
      this.anims.play(this.name, true)
      this.timer = this.scene.time.addEvent({ delay: 1000, callback: this.throwArrow, callbackScope: this, loop: true });

    }

    throwArrow () {
      if (!this.active) return;
      if (Phaser.Math.Between(0, 10) > 9) {
        console.log("Throw it!!")
        const velocity = this.name === "skeleton0" ? 100 : -100
        this.scene.arrows.add(new Arrow(this.scene, this.x, this.y, velocity))
      }

    }

    destroy () {
      this.timer.destroy();
      super.destroy();
    }

    animationComplete (animation, frame) {
        if (animation.key === "skeletondeath") {
            this.destroy();
        }
    }
  }
  

  class Arrow extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, velocity=100) {
        super(scene, x, y, "arrow")
        this.scene = scene;
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setVelocityX(velocity)
        this.body.setSize(32, 16)
        this.setOrigin(0.5)
        this.flipX = velocity < 0;
    
        this.body.setAllowGravity(false);
        this.init();
    }

    init () {
      this.scene.anims.create({
        key: "arrow",
        frames: this.scene.anims.generateFrameNumbers("arrow", { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
      });
      this.anims.play("arrow", true)
    }
  }
  