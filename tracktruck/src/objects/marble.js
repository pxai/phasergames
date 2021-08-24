class Marble extends Phaser.GameObjects.Sprite {
    constructor (scene) {
        const x = Phaser.Math.Between(scene.physics.world.bounds.width, scene.physics.world.bounds.width + 50);
        const y = Phaser.Math.Between(0, scene.physics.world.bounds.height);
        const number = Phaser.Math.Between(1, 9);
        super(scene, x, y, `marble${number}`);
        this.number = number;
        this.scene = scene;
        this.setOrigin(0.5)
        this.active = true;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setVelocityX(-100);
        
        this.collider = this.scene.physics.add.overlap(this.scene.player, this, this.scene.player.pickMarble, null, this.scene.player);
    }
}

export default Marble;
