class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, number) {
      super(scene, x, y, "player")
      this.setOrigin(0.5)
      this.scene = scene;
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.collideWorldBounds = true;
      this.setScale(1)
      this.init();
      this.jumping = false;
      this.invincible = false;
      this.health = 10;
      this.body.mass = 10;
      this.body.setDragY = 10;
    }

    init () {
        this.scene.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "jump",
            frames: this.scene.anims.generateFrameNumbers("player", { start:1, end: 1 }),
            frameRate: 5,
        });

        this.anims.play("walk", true);
    }    
  
  }

export default Player;
  