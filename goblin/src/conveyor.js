class Conveyor extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name="conveyor", rotation = "") {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.setOrigin(0, 0)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;
     }
   }
  
  
  export default Conveyor;