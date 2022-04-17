import {Particle} from "./particle";

export default class Skeleton extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name, type) {
        super(scene, x, y, "skeleton")
        this.name = name;
        this.scene = scene;
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.type = +type;
        this.body.setSize(32, 32)
        this.setOrigin(0.5)
        this.flipX = this.name === "skeleton1";
        this.body.setImmovable(true)
        this.body.setAllowGravity(false);
        this.init();
    }
  
    init () {
      this.scene.anims.create({
        key: "wizard",
        frames: this.scene.anims.generateFrameNumbers("skeleton", { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1
      });
    
      this.scene.anims.create({
        key: "wizardshot",
        frames: this.scene.anims.generateFrameNumbers("skeleton", { start: 2, end: 3 }),
        frameRate: 3,
      });
  

      this.on('animationcomplete', this.animationComplete, this);
      this.anims.play("wizard", true)
      if (this.type >= 0) {
        const delay = (this.type === 0) ? 1000 : this.type * 1000;
        this.timer = this.scene.time.addEvent({ delay, callback: this.throwArrow, callbackScope: this, loop: true });
      } else if (this.type === -1) {
        this.timer = this.scene.time.addEvent({ delay: 3000, callback: this.directShot, callbackScope: this, loop: true });
      }

    }

    throwArrow () {
      if (!this.active) return;
      if (this.type > 0 || (this.type === 0 && Phaser.Math.Between(0, 10) > 9)) {
        this.shot();
      }
    }

    shot() {
      this.anims.play("wizardshot", true)
      const velocity = this.name === "skeleton0" ? 100 : -100
      this.scene.arrows.add(new Fireball(this.scene, this.x, this.y, velocity))
    }

    directShot() {
      const distance = Phaser.Math.Distance.BetweenPoints(this.scene.player, this);
      this.anims.play("wizardshot", true)
      const fireball = new Fireball(this.scene, this.x, this.y, 0)
      this.scene.arrows.add(fireball)
      this.scene.physics.moveTo(fireball, this.scene.player.x, this.scene.player.y, 100);
    }

    destroy () {
      this.timer.destroy();
      super.destroy();
    }

    animationComplete (animation, frame) {
        if (animation.key === "wizardshot") {
          this.anims.play("wizard", true)
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


  class Fireball extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, velocity=100) {
        super(scene, x, y, "wizardshot")
        this.scene = scene;
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setVelocityX(velocity)
        this.body.setSize(32, 16)
        this.setOrigin(0.5)
        this.flipX = velocity < 0;
    
        this.body.setAllowGravity(false);
        this.scene.events.on("update", this.update, this);
        this.init();
    }

    update () {
      if (Phaser.Math.Between(0,5)> 4)
      this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y, 0x95b8c7, 2, false));
    }

    init () {
      this.scene.tweens.add({
        targets: this,
        scale: {from: 1, to: 0.7},
        duration: 400,
        repeat: -1,
        yoyo: true
      })
    }
  }
  