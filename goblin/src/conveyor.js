class Conveyor extends Phaser.GameObjects.TileSprite {
    constructor (scene, x, y, name="conveyor", direction = 1) {
        super(scene, x, y, 800, 16,  name);
        this.scene = scene;
        this.name = name;
        this.direction = direction;
        this.setOrigin(0, 0)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;
        this.scene.events.on("update", this.update, this);
     }

     update () {
      this.tilePositionX += this.direction;
     }
   }
  
  
  export default Conveyor;