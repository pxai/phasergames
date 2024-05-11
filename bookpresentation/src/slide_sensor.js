class SlideSensor extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, number,  width = 10, height=500) {
        super(scene, x, y, width, height, 0xffffff);
        this.number = number;
        this.setOrigin(0.5)
        this.setAlpha(0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
        this.active = true;
     }

     disable () {
        this.active = false;
        this.scene.time.delayedCall(2000, () => { this.active = true}, null, this);
     }

  }

  export default SlideSensor;