class Obstacle extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "player") {
        super(scene, x, y, name);
        this.scene = scene;
        this.id = Math.random();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setCircle(24);
        this.body.setOffset(6, 12)
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "starshipped", score, 20, 0xfffd37).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 1000,
            alpha: {from: 1, to: 0},
            y: {from: text.y - 10, to: text.y - 100}
        });
    }    
}

export default Obstacle;
