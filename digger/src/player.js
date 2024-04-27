import { Smoke } from "./particle";
import Explosion from "./explosion";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, number, attack, velocity, shield, life) {
      super(scene, x, y, "player")
      this.setOrigin(0.5)
      this.setScale(0.7)
      this.scene = scene;
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.setAllowGravity(false);
      this.body.collideWorldBounds = true;
      this.body.setSize(60, 60)
      this.cursor = this.scene.input.keyboard.createCursorKeys();

      this.init();
      this.drilling = false; // TODO
      this.drillTime = 0;
      this.health = 10;
      this.attack = attack;
      this.velocity = velocity;
      this.shield = shield;
      this.life = life;
      this.death = false;
      this.setMouse()
    }

    activate () {
        this.death = false;
    }

    setMouse () {
        this.scene.input.mouse.disableContextMenu();
        this.scene.input.on('pointerdown', (pointer) => this.handleMouseDown(pointer), this);
        //this.scene.input.on('pointerup', (pointer) => this.handleMouseUp(pointer), this);
    }

    handleMouseDown () {
        this.drilling = !this.drilling;
    }

    handleMouseUp () {
        this.drilling = false;
    }

    init () {
        this.scene.anims.create({
            key: "idledown",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end:1 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "drilldown",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "idleup",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "drillup",
            frames: this.scene.anims.generateFrameNumbers("player", { start:4, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "idleleft",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 8, end: 9 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "drillleft",
            frames: this.scene.anims.generateFrameNumbers("player", { start:8, end: 11 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "idleright",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 12, end: 13 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "drillright",
            frames: this.scene.anims.generateFrameNumbers("player", { start:12, end: 15 }),
            frameRate: 5,
            repeat: -1
        });

        this.last = "down";
        this.anims.play("idledown", true);

        this.on('animationcomplete', this.animationComplete, this);

    }    

    getSpeeds () {
        let dx = (this.scene.input.mousePointer.x + this.scene.cameras.main.worldView.x) - this.x;
        let dy = (this.scene.input.mousePointer.y + this.scene.cameras.main.worldView.y) - this.y;
        let angle = Math.atan2(dy, dx) - Math.PI/2;
        let dir = (angle - this.rotation) / (Math.PI * 2);
        dir -= Math.round(dir);
        dir = dir * Math.PI * 2;

        this.newSpeed = (Math.abs(dx) + Math.abs(dy)/2)/100
        this.body.rotation += dir * 100
    }
  
    update (time, delta) {
       if (this.drilling && this.scene.canMove()) {
        const point = this.scene.cameras.main.getWorldPoint(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y)
        this.body.x = point.x;
        this.body.y = point.y;
        if (Phaser.Math.Between(0, 3) > 2) new Smoke(this.scene, this.x, this.y - 32)
       }
     }

    animationComplete (animation, frame) {
        if (animation.key === "playercast" + this.number) {
            this.casting = false;
            this.anims.play("playeridle" + this.number, true);
            this.scene.playAudio("cast2")
        }

        if (animation.key === "playerdead" + this.number) {
            this.scene.scene.start('game_over')
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
  