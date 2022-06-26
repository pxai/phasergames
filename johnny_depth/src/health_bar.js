class HealthBar extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y) {
        super(scene, scene.player.x, scene.player.y + 200, scene.player.health * 5.8, 20, 0x008722);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)

        //this.healthBar = this.add.rectangle(scene.center_width - 1, this.height - 41, this.player.health * 5.8, 20, 0x008722).setOrigin(0.5).setScrollFactor(0);
        this.healthText = scene.add.bitmapText(scene.center_width - 1, scene.height - 31,  "pixelFont", "HEALTH", 15).setTint(0x000000).setOrigin(0.5).setScrollFactor(0);
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