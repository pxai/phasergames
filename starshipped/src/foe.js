import Particle from "./particle";
import Shot from "./shot";
import EasyStar from "easystarjs";

class Foe extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, grid, name = "foeship") {
        super(scene, x, y, name);
        this.scene = scene;
        this.grid = grid;
        this.id = Math.random();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.rotation = 15;
        this.body.setCircle(26);
        this.body.setOffset(6, 9)
        this.power = 0;

        this.speed_x = 0;// This is the speed it's currently moving at
        this.speed_y = 0;
        this.speed = 20; // This is the parameter for how fast it should move 
        this.friction = .95;
        this.death = false;
        this.easystar = new EasyStar.js();
        this.init();
    }

    init () {
        this.easystar.setGrid(this.grid);
        this.easystar.setAcceptableTiles([0]);
        this.move();
    }

    move () {
        try {
            this.easystar.findPath(Math.floor(this.x), Math.floor(this.y), Math.floor(this.scene.player.x), Math.floor(this.scene.player.y), this.moveIt.bind(this));
            this.easystar.setIterationsPerCalculation(10000);
            this.easystar.enableSync();
            this.easystar.enableDiagonals();
            this.easystar.calculate();
            this.scene.time.delayedCall(2000, () => this.move())
        } catch (err) {
            console.log("Cant move yet: ", err)
        }

    }

    moveIt (path) {
        if (path === null) {
            console.log("Path was not found.");
        } else {
            console.log("Path was found. "+  path.length +", The first Point is " + path[0].x + " " + path[0].y, "Last: ", path[path.length-1].x + " " + path[path.length-1].y);
            let tweens = [];
            this.i = 0;
            this.path = path;
            for(let i = 0; i < path.length-1; i++){
                let ex = path[i+1].x;
                let ey = path[i+1].y;
                tweens.push({
                    targets: this,
                    duration: 10,
                    x: ex,
                    y: ey
                });
            }
        
            this.scene.tweens.timeline({
                tweens: tweens
            });
        }
    }

    shoot (pointer) {
        //if (this.power > 0) {
            this.getSpeeds();
            
            this.scene.shots.add(new Shot(this.scene, this.x, this.y, this.speed_x, this.speed_y, this.id))
            this.power--;
       // }
    }


    update () {
        if (this.death) return;
        // Lerp rotation towards mouse
        this.getSpeeds()
        /*if (this.i < this.path.length - 5) {
            this.speed_x = Math.cos(this.rotation + Math.PI/2) * this.speed * 2;
            this.speed_y = Math.sin(this.rotation + Math.PI/2) * this.speed * 2;

            this.x = this.path[this.i].x;
            this.y = this.path[this.i].y;
            this.i += 5;

        }*/

        //console.log("HEre is foo: ", this.x, this.y);

            if (Phaser.Math.Between(1, 4) > 1) {
                this.scene.thrust.add(new Particle(this.scene, this.x , this.y , 0xffffff, 10))
                //new Particle(this.scene, this.x , this.y ,  50, -1)
                //new Particle(this.scene, this.x , this.y,  50, -1)
            }
        // Tell the server we've moved 
        //// this.socket.emit('move-player',{x:this.x,y:this.y,angle:this.rotation})
    }
        
    getSpeeds () {
        let dx = (this.scene.player.x + this.scene.cameras.main.worldView.x) - this.x;
        let dy = (this.scene.player.y + this.scene.cameras.main.worldView.y) - this.y;
        let angle = Math.atan2(dy, dx) - Math.PI/2;
        let dir = (angle - this.rotation) / (Math.PI * 2);
        dir -= Math.round(dir);
        dir = dir * Math.PI * 2;

        this.newSpeed = (Math.abs(dx) + Math.abs(dy)/2)/100
        this.body.rotation += dir * 100
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
        this.death = true;
        super.destroy();
    }      
}

export default Foe;