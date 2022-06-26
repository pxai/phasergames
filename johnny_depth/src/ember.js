class Ember extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "ember") {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.setScale(1);
        this.setOrigin(0.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames:  this.scene.anims.generateFrameNumbers(this.name),
            frameRate: 5,
            repeat: -1
        });//0x0099dc
        this.light = this.scene.lights.addLight(this.x, this.y, 64).setColor(0xffffff).setIntensity(4.0);
        this.anims.play(this.name, true);
        this.tween = this.scene.tweens.add({
            targets: this,
            duration: 500,
            y: this.y - 20,
            repeat: -1,
            yoyo: true
        })  
    }

    pick () {
        const {x, y} = this.scene.cameras.main.getWorldPoint(this.scene.scoreEmberLogo.x, this.scene.scoreEmberLogo.y);
        this.scene.lights.removeLight(this.light);
        this.destroy();
    }
}

export default Ember;
