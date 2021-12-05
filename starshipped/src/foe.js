import Particle from "./particle";
import Shot from "./shot";
import EasyStar from "easystarjs";

class Foe extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, grid, name = "foeship") {
        super(scene, x, y, name);
        this.scene = scene;
        this.grid = grid;
        this.id = "FOE";
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.rotation = 15;
        this.body.setCircle(26);
        this.body.setOffset(6, 9)
        this.power = 0;
        this.body.setBounce(0.8)

        this.speed_x = 0;// This is the speed it's currently moving at
        this.speed_y = 0;
        this.speed = 0.35; // This is the parameter for how fast it should move 
        this.friction = .95;
        this.death = false;
        this.easystar = new EasyStar.js();
        this.init();
    }

    init () {
        this.easystar.setGrid(this.grid);
        this.easystar.setAcceptableTiles([0]);

        this.launchMove();
    }

    launchMove() {
        this.move();
        if (!this.scene) return;
        this.delayedMove = this.scene.time.addEvent({
            delay: 3000,                // ms
            callback: this.move.bind(this),
            startAt: 0,
            callbackScope: this,
            loop: true
        });
    }

    move () {
        try {
            if (this.moveTimeline) this.moveTimeline.destroy();
            this.easystar.findPath(Math.floor(this.x), Math.floor(this.y), Math.floor(this.scene.player.x), Math.floor(this.scene.player.y), this.moveIt.bind(this));
            this.easystar.setIterationsPerCalculation(10000);
            this.easystar.enableSync();
            this.easystar.enableDiagonals();
            this.easystar.calculate();
        } catch (err) {
            console.log("Cant move yet: ", err)
        }

    }

    moveIt (path) {
        if (path === null) {
            console.log("Path was not found.");
        } else {
            let tweens = [];
            this.i = 0;
            this.path = path;
            for(let i = 0; i < path.length-1; i++){
                let ex = path[i+1].x;
                let ey = path[i+1].y;
                tweens.push({
                    targets: this,
                    duration: 8,
                    x: ex,
                    y: ey
                });
            }
        
            this.moveTimeline = this.scene.tweens.timeline({
                tweens: tweens,
                onComplete: () => {
                    this.delayedMove.remove()
                    this.launchMove();
                }
            });
        }
    }

    shoot (pointer) {
            this.getSpeeds();
            this.scene.playAudio("foeshot")
            this.scene.shots.add(new Shot(this.scene, this.x, this.y, this.speed_x, this.speed_y, this.id))
            this.power--;
    }


    update () {
        if (this.death) return;
        this.getSpeeds()
        this.speed_x += Math.cos(this.rotation + Math.PI/2) * this.speed;
        this.speed_y += Math.sin(this.rotation + Math.PI/2) * this.speed;

        //if (Phaser.Math.Between(1, 101) > 100 ) this.shoot();

            if (Phaser.Math.Between(1, 4) > 1) {
                this.scene.thrust.add(new Particle(this.scene, this.x , this.y , 0xffffff, 10))
            }
        // Tell the server we've moved 
        //// this.socket.emit('move-player',{x:this.x,y:this.y,angle:this.rotation})
    }
        
    getSpeeds () {
        let dx = (this.path[this.i].x + this.scene.cameras.main.worldView.x) - this.x;
        let dy = (this.path[this.i].y + this.scene.cameras.main.worldView.y) - this.y;
        let angle = Math.atan2(dy, dx) - Math.PI/2;
        let dir = (angle - this.rotation) / (Math.PI * 2);
        dir -= Math.round(dir);
        dir = dir * Math.PI * 2;

        this.newSpeed = (Math.abs(dx) + Math.abs(dy)/2)/100
        this.body.rotation += dir * 100
        this.i++;
    }

    addEnergy(power) {
        this.power = this.power + power;
        this.showPoints("+" + power)
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "starshipped", score, 20, 0xfffd37).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 2000,
            alpha: {from: 1, to: 0},
            y: {from: text.y - 10, to: text.y - 100}
        });
    }

    destroy () {
        this.delayedMove.remove()
        this.death = true;
        super.destroy();
    }      
}

export default Foe;