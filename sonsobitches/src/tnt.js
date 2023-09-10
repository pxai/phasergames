
class Tnt  extends Phaser.GameObjects.Container {
    constructor (scene, x, y, name = "gold") {
        super(scene, x, y);
        this.scene = scene;
        this.name = name;
        this.setScale(0.8);


        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(64, 64)
        this.sprite = this.scene.add.sprite(0, 0 , "tnt");
        this.sprite.setOrigin(0)
        //this.sprite.rotation = Phaser.Math.Between(0.0, 2.0)
        this.shadow = this.scene.add.rectangle(12, 128, 48, 8, 0x000000);
        this.shadow.setOrigin(0)
        this.add(this.shadow);
        this.add(this.sprite);
        this.body.immovable = true;
        this.body.moves = false;
        this.disabled = false;
        this.init();
    }

    init () {
        this.scene.events.on("update", this.update, this);
        this.light = this.scene.lights.addLight(this.x, this.y, 100).setColor(0xffffff).setIntensity(4.0);
        this.scene.tweens.add({
            targets: this.sprite,
            duration: 500,
            y: this.sprite.y - 10,
            repeat: -1,
            yoyo: true
        })

        this.scene.tweens.add({
            targets: this.shadow,
            duration: 500,
            scale: { from: 1, to: 0.5},
            repeat: -1,
            yoyo: true
        })
    }
}

export default Tnt;
