

export default class Heart extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "heart");
    
        this.scene = scene;
        this.name = "heart";
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.body.immovable = true;
        this.body.moves = false;
        this.init();
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

}
