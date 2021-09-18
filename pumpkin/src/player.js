export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, name);
        this.startX = x;
        this.startY = y;
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.body.setSize(20,30);
        this.init();
    }

    init () {
        this.body.setCollideWorldBounds(true);
        this.setOrigin(0.5);

        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    update () {
        if (this.cursors.left.isDown) {
            this.setFlipX(true);
            //this.body.x--;
            this.setVelocityX(-50);
        } else if (this.cursors.right.isDown) {
            this.setFlipX(false);
            this.setVelocityX(50);
        } else if (this.cursors.down.isDown) {
           //this.body.y++;
           this.setVelocityY(50);
        } else if (this.cursors.up.isDown) {
            this.setVelocityY(-50);
            //this.body.y--;
        } else {
            this.setVelocity(0,0)
            this.anims.stop();
        }
    }
}
