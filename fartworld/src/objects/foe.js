export default class Foe extends Phaser.GameObjects.Sprite {
    constructor ({ scene, x, y, name }) {
        super(scene, x, y, "bean");
        this.scene = scene;
        this.name = "tomato"; // name;
        this.setTween();
        this.right = Phaser.Math.Between(-1, 1) > 0;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.platformCollider = this.scene.physics.add.collider(this, this.scene.platforms);
        this.platformLimitsCollider = this.scene.physics.add.overlap(this.scene.platformLimits, this,this.limitTouch, null, this.scene );
        this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.touch, null, this.scene);
        this.init();
        this.fartCollider = 0;
    }

    init () {
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.setOrigin(0.5);

        this.scene.anims.create({
            key: "fall",
            frames: [{ key: this.name, frame: 0 }],
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "death",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 3, end: 5 }),
            frameRate: 5,
        });
        //this.animation = this.play({ key: "walk", repeat: -1 });
        if (this.right) { this.flipX = true; }
        this.body.setVelocityX(100);
    }

    update () {
        if (this.body) {
            if (this.body.onFloor()) {
                this.anims.play("walk", true);
            } else {
                this.anims.play("fall", true);
            }
            this.flipX = (this.body.velocity.x > 0);
        }
    }

    setTween () {
    }

    touch (player, foe) {
        console.log("Touched, player DEATH ", player, foe);
        foe.overlap.active = false;
        player.scene.playerDeath(player);
    }

    setFartCollider(collider) {
        this.fartCollider = collider;
    }

    farted(fart, foe, x) {
        console.log("Farted ", fart, foe, fart.tint);
        foe.fartCollider.active = false;
        fart.body.destroy();
        foe.body.setVelocityY(-100);
        foe.body.setVelocityX(-foe.body.velocity.x);
    }

    death() {
        console.log("Im dead ", this, this.name);
        //foe.play({ key: "death", repeat: -1 });

        this.disable();
       // fart.destroy();

        // this.destroy();
    }

    limitTouch(foe, limit) {
        foe.body.setVelocityX(-foe.body.velocity.x);
    }

    disable () {
        this.visible = false;
        this.overlap.active = false;
    }

    enableAgain () {
        this.visible = true;
        this.overlap.active = true;
    }

    destroy() {
        super.destroy();;
    }
}
