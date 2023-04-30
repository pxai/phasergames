import { Dust } from "./dust";

export default class Muffin extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "muffin") {
        super(scene, x, y, "muffin");
        this.scene = scene;
        this.name = name;   

        scene.add.existing(this);
        scene.physics.add.existing(this);

        //this.sprite.rotation = Phaser.Math.Between(0.0, 2.0)
        this.muffinTop = new MuffinTop(this.scene, x, y - 32, this);
        this.muffinTop.setScale(0.5)
        this.converyorSpeed = -200;
        this.muffinTop.setOrigin(0.5)

        scene.physics.add.existing(this.muffinTop);
        this.muffinTop.body.setAllowGravity(false);
        this.muffinTop.body.setSize(16, 32)
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
            scale: { from: 0.5, to: 0.6},
            repeat: -1,
            yoyo: true
        })  
    }

    update () {
        if (!this.completed && this.muffinTop) {
            this.muffinTop.x = this.x;
            this.muffinTop.y = this.y - 32;
            if (this.scene && Phaser.Math.Between(1, 31) > 50) new Dust(this.scene, this.x + 16, this.y + 16)
        }
    }

    setCompleted () {
        this.completed = true;
        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            x: {from: this.x, to: this.scene.timerText.x},
            y: {from: this.y, to: this.scene.timerText.y},
            onComplete: () => {
                this.scene.addPoints();
                this.destroy();
            }
        })
    }
}

class MuffinTop extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, muffin) {
        super(scene, x, y, "muffintop");
        this.scene = scene;
        this.muffin = muffin;

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }


    setCompleted () {
        this.muffin.setCompleted();
        this.destroy();
    }
}



