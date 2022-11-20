class HealthBar extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, seconds = 20) {
        super(scene, x, y, seconds * 20, 20, 0x0eb7b7)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)

        this.scene.events.on("update", this.update, this);
        this.scene = scene;
        this.seconds = seconds;
        this.scene.time.delayedCall(1000, () => {
            this.timerStart();
        }, null, this)
     }

     timerStart () {
        if (this.seconds > 0)
            this.scene.time.delayedCall(1000, () => {
                this.seconds--; 
                this.width = this.seconds * 20;
                this.timerStart();
            }, null, this)
        else
            this.scene.timerFinished();
     }
  
  }
  
  export default HealthBar;