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
        this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.touch, null, this.scene);
        this.init();
    }

    init () {
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.setOrigin(0.5);

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
        this.animation = this.play({ key: "walk", repeat: -1 });
        if (this.right) { this.flipX = true; }
    }

    update () {

        if (this.right) {
            this.body.setVelocityX(120);
        } else {
            this.body.setVelocityX(-120);
        }
    }

    setTween () {
    }

    touch (player, foe) {
        console.log("Touched, player DEATH ", player, foe);
        foe.overlap.active = false;
        player.scene.playerDeath(player);

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
