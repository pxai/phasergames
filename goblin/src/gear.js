export default class Gear extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "gear");
        this.setOrigin(0.5);
        this.rotation = Phaser.Math.Between(1, 100)
        this.scene = scene;
        scene.add.existing(this);
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this, 
            duration: 200,
            rotation: "+=1",
            repeat: -1
        });
    }
}