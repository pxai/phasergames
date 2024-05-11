class Checkpoint extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, width = 10, height=400) {
        super(scene, x, y, width, height, 0xffffff);
        this.setOrigin(0)
        this.setAlpha(0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
     }
  
  }
  
  export default Checkpoint;