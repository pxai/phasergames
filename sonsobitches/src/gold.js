import Glitter from "./particle";

class Gold  extends Phaser.GameObjects.Container {
    constructor (scene, x, y, name = "gold") {
        super(scene, x, y);
        this.scene = scene;
        this.name = name;
        this.setScale(0.4);


        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(64, 64)
        this.sprite = this.scene.add.sprite(0, 0 , "gold" + Phaser.Math.RND.pick([0, 1, 2, 3]));
        this.sprite.setOrigin(0)
        //this.sprite.rotation = Phaser.Math.Between(0.0, 2.0)
        this.shadow = this.scene.add.rectangle(12, 128, 48, 8, 0x000000);

        this.light = this.scene.lights.addLight(x + 16, y + 16, 50).setColor(0xffffff).setIntensity(1.5);
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
        this.light = this.scene.lights.addLight(this.x, this.y, 100).setColor(0xffffff).setIntensity(7.0);
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

    update() {
        if (this.active && Phaser.Math.Between(0,10) > 8) {}
            //new Glitter(this.scene, Phaser.Math.Between(this.x-18, this.x+18), Phaser.Math.Between(this.y - 18, this.y + 18), 3,5)
    }
}

export default Gold;
