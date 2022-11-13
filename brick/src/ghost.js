class Ghost extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "brick0")
        this.setAlpha(0.8)
        scene.add.existing(this);
        scene.tweens.add({
            targets: [this],
            x: { from: this.x, to: scene.recycledBrick.x},
            y: { from: this.y, to: scene.recycledBrick.y},
            scale: {from: 1, to: 0.7}, 
            duration: 500,
            onComplete: () => {
                this.destroy();
            }
        })
        scene.events.on("update", this.update, this);
    }
}

export default Ghost;
