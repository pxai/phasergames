

class Exit extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name="exit") {
        super(scene, x + 32, y + 32, name);
        this.scene = scene;
        this.name = name;
        this.setOrigin(0, 0)

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;
     }
   }
  
  
  export default Exit;