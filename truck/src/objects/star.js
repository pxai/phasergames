class Star extends Phaser.GameObjects.Rectangle {
    constructor (scene, x = 800, color = 0xffffff) {
        const y = Phaser.Math.Between(0, 600);
        const scale = Phaser.Math.Between(0, 5);
        const alpha = Phaser.Math.Between(0.4, 1)
        const rotation = Phaser.Math.Between(0, 1) >= 0.5 ? 0 : 45;
        super(scene, x, y, 2, 2, color, alpha).setScale(scale);
        //this.scene = scene;
        //this.scene.add.existing(this);
    }
}

export default Star;
