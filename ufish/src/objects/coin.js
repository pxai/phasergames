export default class Coin extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, name);
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(true);
   
        this.tracked = false;
        this.body.setBounce(0.5)
    
        const coinAnimation = this.scene.anims.create({
            key: "coin",
            frames: this.scene.anims.generateFrameNumbers("coin", { start: 0, end: 7 }, ),
            frameRate: 8,
        });
        this.play({ key: "coin", repeat: -1 });
    }

    update () {
        if (this.scene) {
            if (this.scene.player && this.scene.player.isTracking() && this.tracked) {
                this.x = this.scene.player.beam.x;
                this.y -= 5;
            } else {
                this.tracked = false;
            } 
        }
    }

    up (beam, coin) {
        coin.tracked = true;

        coin.body.setVelocityX(0); 
    }

    disable () {
        this.visible = false;
        this.destroy();
    } 
  
    destroy() {
        super.destroy();
    }
}