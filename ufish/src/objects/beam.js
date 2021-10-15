class Beam extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, layer) {
        super(scene, x, y, "beam");
        this.scene = scene;
        this.setOrigin(0.5)
        layer.add(this)
       // scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;

        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            alpha: {from: 0.5, to: 0.9 },
            repeat: -1,
            yoyo: true
        })

        this.scene.anims.create({
            key: "beam",
            frames: this.scene.anims.generateFrameNumbers("beam"),
            frameRate: 5,
            repeat: -1
          });
  
          this.anims.play("beam", true)
    } 
}

export default Beam;
