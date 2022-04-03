class Exit extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "exit");
        scene.add.existing(this);
        scene.physics.add.existing(this);
  
        this.body.immovable = true;
        this.body.moves = false;
     }
  
  }
  
  export default Exit;