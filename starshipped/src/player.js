import Particle from "./particle";
import Shot from "./shot";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "ship1_1") {
        super(scene, x, y, name);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.rotation = 15;
        this.body.setCircle(26);
        this.body.setOffset(6, 9)

        this.speed_x = 0;// This is the speed it's currently moving at
        this.speed_y = 0;
        this.speed = 0.35; // This is the parameter for how fast it should move 
        this.friction = .95;
        this.death = false;
        this.init();
    }

    init () {
        this.scene.input.on('pointerdown', (pointer) => this.shoot(pointer), this);
        this.scene.input.on('pointerup', (pointer) => this.release(pointer), this);
    }

    shoot (pointer) {
        console.log(pointer.x, pointer.y, 'logo');
        this.getSpeeds();
        this.scene.shots.add(new Shot(this.scene, this.x, this.y, this.speed_x, this.speed_y))
    }

    release(pointer) {
        if (pointer.leftButtonReleased()) {
            this.shooting = false;
            console.log("Release!")
        }
    }

    update () {
        if (this.death) return;
        // Lerp rotation towards mouse
        this.getSpeeds()

            this.speed_x += Math.cos(this.rotation + Math.PI/2) * this.speed;
            this.speed_y += Math.sin(this.rotation + Math.PI/2) * this.speed;

            console.log("Rotation: ", this.rotation, this.speed_x, this.speed_y)
            if (Phaser.Math.Between(1, 4) > 1) {
                this.scene.thrust.add(new Particle(this.scene, this.x , this.y ,  50, -1, 10, 0.3))
                //new Particle(this.scene, this.x , this.y ,  50, -1)
                //new Particle(this.scene, this.x , this.y,  50, -1)
            }
       // }
        
        this.x += this.speed_x;
        this.y += this.speed_y;

        this.speed_x *= this.friction;
        this.speed_y *= this.friction;

        // To make player flash when they are hit, set player.spite.alpha = 0
        if(this.alpha < 1){
            this.alpha += (1 - this.alpha) * 0.16;
        } else {
            this.alpha = 1;
        }
      
        // Tell the server we've moved 
        //// this.socket.emit('move-player',{x:this.x,y:this.y,angle:this.rotation})
    }
        
    getSpeeds () {
        let dx = (this.scene.input.mousePointer.x + this.scene.cameras.main.x) - this.x;
        let dy = (this.scene.input.mousePointer.y + this.scene.cameras.main.y) - this.y;
        let angle = Math.atan2(dy, dx) - Math.PI/2;
        let dir = (angle - this.rotation) / (Math.PI * 2);
        dir -= Math.round(dir);
        dir = dir * Math.PI * 2;

        this.newSpeed = (Math.abs(dx) + Math.abs(dy)/2)/100
        console.log(dx, dy, "SPEED: ", this.newSpeed)

        this.body.rotation += dir * 100
    }

    destroy () {
        this.death = true;
        console.log("About to destroy: ", this.scene);
        super.destroy();
    }
      
}

export default Player;