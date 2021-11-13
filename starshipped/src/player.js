import Particle from "./particle";
import Shot from "./shot";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "ship1_1") {
        super(scene, x, y, name);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.rotation = 0;
        //this.anchor.setTo(0.5,0.5);
        this.speed_x = 0;// This is the speed it's currently moving at
        this.speed_y =0;
        this.speed = 0.5; // This is the parameter for how fast it should move 
        this.friction = .95;
        this.shooting = false;
        this.init();
    }

    init () {
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursor = this.scene.input.keyboard.createCursorKeys();

        this.scene.input.on('pointerdown', (pointer) => this.shoot(pointer), this);
        this.scene.input.on('pointerup', (pointer) => this.release(pointer), this);
    }

    shoot (pointer) {
       // if (this.shooting) return;
        //this.shooting = true;
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
        // Lerp rotation towards mouse
        this.getSpeeds()

        // Move forward
        if(this.W.isDown || this.cursor.up.isDown){

            this.speed_x += Math.cos(this.rotation + Math.PI/2) * this.speed;
            this.speed_y += Math.sin(this.rotation + Math.PI/2) * this.speed;

            console.log("Rotation: ", this.rotation, this.speed_x, this.speed_y)
            if (Phaser.Math.Between(1, 4) > 1) {
                new Particle(this.scene, this.x - (this.speed_x * 7), this.y - (this.speed_y * 3),  50, -1)
                new Particle(this.scene, this.x - (this.speed_x * 8), this.y - (this.speed_y * 5),  50, -1)
                new Particle(this.scene, this.x - (this.speed_x * 9), this.y - (this.speed_y * 8),  50, -1)
            }
        }
        
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
        this.body.rotation += dir * 10;
    }
      
}

export default Player;