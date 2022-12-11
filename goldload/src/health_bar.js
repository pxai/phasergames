class HealthBar extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, seconds = 20) {
        super(scene, x, y, 5 * seconds, 20, 0x0eb7b7)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
        this.initSeconds = seconds;
        this.scene.events.on("update", this.update, this);
        this.scene = scene;
        this.seconds = seconds;
        this.totalWidth = seconds * (scene.number + 1) * 20
        this.scene.time.delayedCall(1000, () => {
            this.timerStart();
        }, null, this)
     }

     timerStart () {
        if (this.seconds > 0)
            this.scene.time.delayedCall(1000, () => {
                this.seconds--; 
                this.width = 5 * this.seconds
                this.timerStart();
                if (this.seconds === this.initSeconds / 2) {
                    this.scene.hurryUp();
                }
            }, null, this)
        else
            this.scene.timerFinished();
     }
  
  }
  
  export default HealthBar;