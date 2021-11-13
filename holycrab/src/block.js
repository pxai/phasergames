class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "block", fixed = true) {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.body.immovable = true;
        this.body.moves = false;

        if (!fixed) this.init();
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