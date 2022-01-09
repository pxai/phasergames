export default class PowerUp extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, velocity) {
        super(scene, x, y, "plenny")
        this.name = "plenny";
        scene.add.existing(this)
        this.setScale(1)
        
        scene.physics.add.existing(this);
        this.body.setAllowGravity(true)

        this.flipX = (velocity > 0) 
        // this.body.setVelocityY(-200)
        //this.body.setVelocityX(velocity);
    }
    

    update() {
       /* if (this.body.blocked.left) {
            this.body.setVelocityX(100)
            this.flipX = true;
        } else if (this.body.blocked.right) {
            this.body.setVelocityX(-100)
            this.flipX = false;
        }*/
    }
}