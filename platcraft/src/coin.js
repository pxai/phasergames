class Coin extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "coin") {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.setScale(0.5);
        this.setOrigin(0.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.immovable = true;
        this.body.moves = false;
        this.disabled = false;
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames:  this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.play(this.name, true);
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            y: this.y - 20,
            repeat: -1,
            yoyo: true
        })  
    }

    pick () {
        const {x, y} = this.scene.cameras.main.getWorldPoint(this.scene.scoreCoinsLogo.x, this.scene.scoreCoinsLogo.y);

        this.disabled = true;
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            x: {from: this.x, to: x},
            y: {from: this.y, to: y},
            scale: {from: 0.7, to: 0.5},
            onComplete: () => { this.destroy()}
        })  
    }
}

export default Coin;
