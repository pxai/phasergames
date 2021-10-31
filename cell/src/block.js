import Bubble from "./bubble";

class Block extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, block, coords, tween = true) {
        super(scene, x, y, block.type);
        this.scene = scene;
        this.block = block;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this)
        this.defaultDirection = Phaser.Math.Between(0, 3);
        this.locked = false;
        this.coords = coords;
        this.init(tween);
    }

    init (tween) {
        if (!tween) return;
        this.tween = this.scene.tweens.add({
            targets: this,
            duration: 300,
            scale: {from: 1, to: 0.8 },
            repeat: -1,
            yoyo: true
        })
    }

    moveDefault () {
           if (this.locked) return;
           console.log("Default direction: ", this.defaultDirection, this.coords)
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
        if (this.checkNextCell(this.coords.x + 1, this.coords.y)) {
            this.x += 32;
            this.coords.x++;
            new Bubble(this.scene, this.x - 16, this.y + Phaser.Math.Between(-10, 10),  50, -1, this.block.color)    
        } else {
            this.scene.blockContact()
        }
    }

    left () {      
        if (this.checkNextCell(this.coords.x - 1, this.coords.y)) {
            this.x -= 32;
            this.coords.x--;
            new Bubble(this.scene, this.x + 16, this.y + Phaser.Math.Between(-10, 10),  50, -1, this.block.color)
        } else {
            this.scene.blockContact()
        }
    }

    up () { 
        if (this.checkNextCell(this.coords.x, this.coords.y - 1)) {       
            this.y -= 32;
            this.coords.y--;
            new Bubble(this.scene, this.x + Phaser.Math.Between(-10, 10), this.y + 16,  50, -1, this.block.color)
        } else {
            this.scene.blockContact()
        }
    }

    down () { 
        if (this.checkNextCell(this.coords.x, this.coords.y + 1)) {    
            this.y += 32;
            this.coords.y++;
            new Bubble(this.scene, this.x + Phaser.Math.Between(-10, 10), this.y - 16,  50, -1, this.block.color)
        } else {
            this.scene.blockContact()
        }
    }

    checkNextCell (nextx, nexty) {
        console.log("NEXT: ", this.scene.wall.cell[nextx][nexty])
        const free = this.scene.wall.cell[nextx][nexty].content === "";
        if (!free) {
            this.scene.wall.cell[this.coords.x][this.coords.y] = this.block.type;
        }
        return free;
    }


    speedUp () {
        if (this.locked) return;
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

    correctPosition () {

    }

    stopSpeed () {
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);
    }

    setBlock () {
        this.setScale(1)
        console.log("HERE WE AREEE PISCHA");
        this.locked = true;
        this.stopSpeed()
        if (this.tween) this.tween.stop();
    }
}

export default Block;