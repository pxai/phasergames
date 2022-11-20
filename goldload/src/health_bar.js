class HealthBar extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y) {
        super(scene, scene.player.x, scene.player.y + 200, scene.player.health * 5.8, 20, 0x0eb7b7);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)

        this.scene.events.on("update", this.update, this);
        this.scene = scene;
     }

     update () {
         if (this.scene && this.scene.player) {
            this.x = this.scene.player.x
            this.y = this.scene.cameras.main.worldView.y + 700
         }
     }
  
  }
  
  export default HealthBar;