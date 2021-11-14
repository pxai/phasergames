class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, finish = false) {
        super(scene, x, y, "block");
        this.scene = scene;
        this.name = "block";
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.body.immovable = true;
        this.body.moves = false;

        this.finish = finish;
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            y: this.y - 20,
            repeat: -1,
            yoyo: true
        })  
    }

    touched () {
        
    }
}

export default Block;