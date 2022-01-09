export default class Wizard extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, "wizard")
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
        key: "wizard0",
        frames: this.scene.anims.generateFrameNumbers("wizard", { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1
      });
    
      this.scene.anims.create({
        key: "wizard1",
        frames: this.scene.anims.generateFrameNumbers("wizard", { start: 2, end: 3 }),
        frameRate: 5,
        repeat: -1
      });
  
      this.scene.anims.create({
        key: "wizard2",
        frames: this.scene.anims.generateFrameNumbers("wizard", { start: 4, end: 5 }),
        frameRate: 5,
        repeat: -1
      });
    
      this.scene.anims.create({
        key: "wizard3",
        frames: this.scene.anims.generateFrameNumbers("wizard", { start: 6, end: 7 }),
        frameRate: 5,
        repeat: -1
      });

      this.scene.anims.create({
        key: "wizarddeath",
        frames: this.scene.anims.generateFrameNumbers("wizard", { start: 8, end: 10 }),
        frameRate: 5,
      });
      this.on('animationcomplete', this.animationComplete, this);
      this.anims.play(this.name, true)
    }

    death () {
        this.anims.play("wizarddeath", true)
    }

    animationComplete (animation, frame) {
        if (animation.key === "wizarddeath") {
            this.destroy();
        }
    }
  }
  
  