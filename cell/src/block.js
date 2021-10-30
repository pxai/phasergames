import Bubble from "./bubble";

class Block extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, block) {
        super(scene, x, y, block.type);
        this.scene = scene;
        this.block = block;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this)
        this.defaultDirection = Phaser.Math.Between(0, 3);
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 300,
            scale: {from: 1, to: 0.8 },
            repeat: -1,
            yoyo: true
        })
    }

    moveDefault () {
            switch (this.defaultDirection) {
                case 0:
                    this.right();
                    break;
                case 1: 
                    this.left();
                    break;
                case 2:
                    this.down();
                    break;
                case 3: 
                    this.up();
                    break;
                default: break;
            }
    }

    right () {
        this.body.x++;
        new Bubble(this.scene, this.x - 16, this.y + Phaser.Math.Between(-10, 10),  50, -1, this.block.color)
    }

    left () {
        this.body.x--;
        new Bubble(this.scene, this.x + 16, this.y + Phaser.Math.Between(-10, 10),  50, -1, this.block.color)
    }

    up () {
        this.body.y--;
        new Bubble(this.scene, this.x + Phaser.Math.Between(-10, 10), this.y + 16,  50, -1, this.block.color)
    }

    down () {
        this.body.y++;
        new Bubble(this.scene, this.x + Phaser.Math.Between(-10, 10), this.y - 16,  50, -1, this.block.color)
    }


    speedUp () {
        switch (this.defaultDirection) {
            case 0:
                this.body.setVelocityX(300)
                break;
            case 1: 
                this.body.setVelocityX(-300)
                break;
            case 2:
                this.body.setVelocityY(300)
                break;
            case 3: 
                this.body.setVelocityY(-300)
                break;
            default: break;
        }
    }

    stopSpeed () {
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);
    }
}

export default Block;