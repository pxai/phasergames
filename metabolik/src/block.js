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
        this.rectangles = Array(4).fill();
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

    showHints () {
        const directions = [
            {x: this.x, y: this.y, w: 1800, h: 32, ox: 0, oy: 0.5}, // 0
            {x: 0, y: this.y, w: -this.x * 2, h: 32, ox: 0.5, oy: 0.5}, // 1
            {x: this.x, y: this.y, w: 32, h: 1800, ox: 0.5, oy: 0}, // 2
            {x: this.x, y: this.y, w: 32, h: -1800, ox: 0.5, oy: 0}, // 3
        ];
        this.rectangles.forEach( rectangle => { 
            this.scene.back.removeAll();
            if (rectangle) {
                rectangle.destroy()
            } 
            
            this.scene.back.add(this.scene.add.rectangle(this.x, this.y, 32, 1800, this.block.color, 0.2).setOrigin(0.5, 0.5))
            this.scene.back.add(this.scene.add.rectangle(this.x, this.y, 1800, 32, this.block.color, 0.2).setOrigin(0.5, 0.5))
            let { x, y, w, h, ox, oy } = directions[this.defaultDirection];
            this.scene.back.add(this.scene.add.rectangle(x, y, w, h, this.block.color, 0.4).setOrigin(ox, oy))
        });
        
    }

    right () {
        if (this.checkNextCell(this.coords.x, this.coords.y + 1)) {
            this.x += 32;
            this.coords.y++;
            this.addBubbles(this.x - 16, this.y + Phaser.Math.Between(-10, 10))    
        } else {
            this.scene.blockContact()
        }
    }

    left () {      
        if (this.checkNextCell(this.coords.x, this.coords.y - 1)) {
            this.x -= 32;
            this.coords.y--;
            this.addBubbles(this.x + 16, this.y + Phaser.Math.Between(-10, 10))
        } else {
            this.scene.blockContact()
        }
    }

    up () { 
        if (this.checkNextCell(this.coords.x - 1, this.coords.y)) {       
            this.y -= 32;
            this.coords.x--;
            this.addBubbles(this.x + Phaser.Math.Between(-10, 10), this.y + 16)
        } else {
            this.scene.blockContact()
        }
    }

    down () { 
        if (this.checkNextCell(this.coords.x + 1, this.coords.y)) {    
            this.y += 32;
            this.coords.x++;

            this.addBubbles(this.x + Phaser.Math.Between(-10, 10), this.y - 16)
        } else {
            this.scene.blockContact()
        }
    }

    addBubbles (x, y) {
        Array(10).fill(0).forEach( i => {
            new Bubble(this.scene, x, y, 50, -1, this.block.color)
        })
    }

    checkNextCell (nextx, nexty) {
         const free = !this.scene.wall.cell[nextx][nexty];
        if (!free) {
            let {x, y} = this.scene.wall.cell[nextx][nexty];
            this.scene.wall.cell[this.coords.x][this.coords.y] = {content: this.block.type, x, y, block: this}
        }
        return free;
    }


    speedUp () {
        if (this.locked) return;
        switch (this.defaultDirection) {
            case 0:
                while (!this.locked) { this.right() }
                break;
            case 1: 
            while (!this.locked) { this.left() }
                break;
            case 2:
                while (!this.locked) { this.down() }
                break;
            case 3: 
            while (!this.locked) { this.up() }
                break;
            default: break;
        }
    }

    stopSpeed () {
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);
    }

    setBlock () {
        this.setScale(1)
        this.locked = true;
        this.stopSpeed()
        if (this.tween) this.tween.stop();
        if (this.coords.x === 12 && this.coords.y === 12) {
            this.scene.gameOver();
        }
    }

    vanish () {
        if (this.scene)
            this.scene.tweens.add({
                targets: this,
                duration: 50,
                alpha: { from: 0, to: 1},
                repeat: 5,
                yoyo: true,
                onComplete: () => {
                    this.destroy()
                }
            })
    }
}

export default Block;