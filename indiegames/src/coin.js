export default class Coin extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, name);
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
  
        this.body.immovable = true;
        this.body.moves = false;
    
        const coinAnimation = this.scene.anims.create({
            key: "coin",
            frames: this.scene.anims.generateFrameNumbers("coin", { start: 0, end: 7 }, ),
            frameRate: 5,
        });
        this.play({ key: "coin", repeat: -1 });
    }

    disable () {
        this.visible = false;
        this.destroy();
    } 
  
    destroy() {
        super.destroy();
    }
}