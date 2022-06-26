class Exit extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "exit");
        scene.add.existing(this);
        scene.physics.add.existing(this);
  
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
     }
  
  }
  
  export default Exit;