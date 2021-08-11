export default class Foe extends Phaser.GameObjects.Sprite {
    constructor ({ scene, x, y, name }) {
        super(scene, x, y, name);

        this.scene = scene;
        this.name = name;
        this.right = Phaser.Math.Between(-1, 1) > 0;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.platformCollider = this.scene.physics.add.collider(this, this.scene.platforms);
        this.platformLimitsCollider = this.scene.physics.add.overlap(this.scene.platformLimits, this,this.limitTouch, null, this.scene );
        this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.touch, null, this.scene);
        this.groundCollider = this.scene.physics.add.overlap(this.scene.ground, this, this.hitGround, null, this );
        this.init();
        this.fartCollider = 0;
        this.dead = false;
    }

    init () {
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.setOrigin(0.5);

        this.scene.anims.create({
            key: "fall" + this.name,
            frames: [{ key: this.name, frame: 0 }],
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "walk" + this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        this.deathAnimation = this.scene.anims.create({
            key: "death" + this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 3, end: 5 }),
            frameRate: 5,
        });

        this.on('animationcomplete', this.animationComplete, this);

        if (this.right) { this.flipX = true; }
        this.body.setVelocityX(100);
    }

    update () {
        if (this.body && !this.dead) {
            if (this.body.onFloor()) {
                this.animate("walk")
                this.platformLimitsCollider.active = true;
            } else {
                this.animate("fall");
                this.platformLimitsCollider.active = false;
            }
            this.flipX = (this.body.velocity.x > 0);
        }
    }

    animate (animation) {
        this.play(animation + this.name, true)
    }

    animationComplete(animation, frame) {
        if (animation.key.startsWith("death")) {
            console.log("Animation complete")
            this.death();
        }
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
        console.log("Farted ", fart, foe, fart.tint, foe.body.speed);
        foe.fartCollider.active = false;
        fart.body.destroy();
        foe.body.setVelocityY(-100);
        foe.body.setVelocityX(-foe.body.velocity.x);
        foe.scene.updateScore(100);
    }

    redFarted (fart, foe) {   
        console.log("Red farted!! ", this);
        this.animate("death");
        this.dead = true;
        this.body.enable = false; 
        this.scene.updateScore(500); 
    }

    hitGround(ground, foe) {
    }

    death() {
        console.log("Im dead ", this, this.name);
        this.dead = true;
        this.destroy();
    }

    limitTouch(foe, limit) {
        foe.body.setVelocityY(-30);
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
