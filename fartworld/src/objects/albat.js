export default class Albat extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "albat");

        this.scene = scene;
        this.name = "albat";

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.touch, null, this.scene);
        this.init();
        this.dead = false;
        this.fartCollider = 0;
        this.life = 10;
    }

    init () {
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.setOrigin(0.5);

        this.scene.anims.create({
            key: "fly" + this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name,{ start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "attack" + this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 2, end: 3 }),
            frameRate: 5,
        });

        this.deathAnimation = this.scene.anims.create({
            key: "death" + this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 4, end: 10 }),
            frameRate: 5,
        });

        this.on('animationcomplete', this.animationComplete, this);

        this.body.setVelocityX(100);
    }

    update () {
        if (this.body && !this.dead) {
            this.animate("fly")
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
        if (!player.dead) {
            console.log("Touched, player DEATH ", player, foe);
            player.scene.playerDeath(player);
        }
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
        this.life--;
        if (this.life === 0) {
            this.animate("death");
            this.dead = true;
            this.body.enable = false; 
            this.scene.updateScore(5000); 
        }
    }


    death() {
        console.log("Im dead ", this, this.name);
        this.dead = true;
        this.destroy();
    }

    disable () {
        this.visible = false;
        this.overlap.active = false;
    }

    destroy() {
        super.destroy();
    }
}
