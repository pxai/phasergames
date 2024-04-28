export default class Foe extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, type="right") {
        super(scene, x, y, "foe");
        this.name = "foe";
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.scene.add.existing(this);
        this.direction = type === "right" ? 1 : -1;
        this.dead = false;
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
          });
  
          this.anims.play(this.name, true)
          this.body.setVelocityX(this.direction * 150);
          this.flipX = this.direction > 0;

          this.scene.events.on("update", this.update, this);
    }


    update () {
      if (this.dead || !this.scene?.mapReady) return
      if (this.shouldTurn()) { this.turn() }
    }

    shouldTurn () { 
      const tile = this.scene.dungeon.groundLayer.getTileAtWorldXY(this.x + (this.direction * 16), this.y + (this.direction * 16))
      return [16].includes(tile?.index)
    }

    turn () {
        this.direction = -this.direction;
        this.flipX = this.direction > 0;
        this.body.setVelocityX(this.direction * 150);
    }

    death () {
        this.dead = true;
        this.body.enable = false;
        this.setAlpha(0)
        this.destroy()
      }

}

