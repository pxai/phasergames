import { Smoke } from "./particle";
import Explosion from "./explosion";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, number, attack, velocity, shield, life) {
      super(scene, x, y, "player")
      this.setOrigin(0.5)
      //this.setScale(0.7)
      this.setTint(0xffffff)
      this.scene = scene;
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.setAllowGravity(false);
      this.body.collideWorldBounds = true;
      this.cursor = this.scene.input.keyboard.createCursorKeys();

      this.init();
      this.drilling = false; // TODO
      this.drillTime = 0;
      this.health = 10;
      this.attack = attack;
      this.velocity = velocity;
      this.shield = shield;
      this.life = life;
      this.death = true;
      this.setMouse()
    }

    activate () {
        this.death = false;
        this.setAlpha(1);
        this.startTween.stop()
    }

    setMouse () {
        this.scene.input.mouse.disableContextMenu();
        this.scene.input.on('pointerdown', (pointer) => this.handleMouseDown(pointer), this);
        //this.scene.input.on('pointerup', (pointer) => this.handleMouseUp(pointer), this);
    }

    handleMouseDown () {
        if (this.death) this.activate()
        this.drilling = !this.drilling;
    }

    handleMouseUp () {
        this.drilling = false;
    }

    init () {
        this.scene.anims.create({
            key: "player",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end:6 }),
            frameRate: 10,
            repeat: -1
        });

        this.startTween = this.scene.tweens.add({
            targets: this,
            duration: 100,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });

        this.last = "down";
        this.anims.play("player", true);
    }   
  
    update () {
       if (this.drilling && this.scene.canMove()) {
        const point = this.scene.cameras.main.getWorldPoint(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y)
        this.body.x = point.x;
        this.body.y = point.y;
        if (Phaser.Math.Between(0, 3) > 2) new Smoke(this.scene, this.x, this.y - 32)
       }
     }

    dead () {
        const explosion = this.scene.add.circle(this.x, this.y, 10).setStrokeStyle(40, 0xffffff);
        this.scene.tweens.add({
            targets: explosion,
            radius: {from: 10, to: 512},
            alpha: { from: 1, to: 0.3},
            duration: 300,
            onComplete: () => { explosion.destroy() }
        })
        this.scene.cameras.main.shake(500);
        this.death = true;
        new Explosion(this.scene, this.x, this.y, 40)
        super.destroy();
    }     

  }

export default Player;
  