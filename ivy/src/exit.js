export default class Exit extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name, tint=null) {
        super(scene, x, y, "exit")
        this.name = name;
        this.setAlpha(1)
        this.setTint(tint)
        this.scene = scene;
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.init()
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers("exit", { start:0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.play(this.name, true);
    }
  }