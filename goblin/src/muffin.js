export default class Muffin extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "muffin") {
        super(scene, x, y, "muffin");
        this.scene = scene;
        this.name = name;
        this.setScale(1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        //this.sprite.rotation = Phaser.Math.Between(0.0, 2.0)
        this.muffinTop = this.scene.add.sprite(x, y - 32 , "muffintop");
        this.converyorSpeed = -200;
        this.muffinTop.setOrigin(0.5)

        scene.physics.add.existing(this.muffinTop);
        this.muffinTop.body.setAllowGravity(false);
        this.scene.muffinTops.add(this.muffinTop)

        this.body.setVelocityX(this.converyorSpeed);
        this.disabled = false;
        this.completed = false;
        this.init();
    }

    init () {
        this.scene.events.on("update", this.update, this);

        this.scene.tweens.add({
            targets: [this, this.muffinTop],
            duration: 500,
            scale: { from: 0.9, to: 1},
            repeat: -1,
            yoyo: true
        })  
    }

    update () {
        if (!this.completed) {
            this.muffinTop.x = this.x;
            this.muffinTop.y = this.body.y - 32;
        }
    }

    setCompleted () {
        this.completed = true;
        this.muffinTop.destroy();
    }
}


