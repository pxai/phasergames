import Particle from "./particle";
import Shot from "./shot";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "ship1_1") {
        super(scene, x, y, name);
        this.scene = scene;
        this.id = Math.random();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setCircle(26);
        this.body.setOffset(6, 9)
        this.power = 0;
        this.body.setBounce(0.8)
        this.speed_x = 0;// This is the speed it's currently moving at
        this.speed_y = 0;
        this.angle = 0;
        this.speed = 0; // This is the parameter for how fast it should move 
        this.friction = .95;
        this.death = false;
        this.init();
    }

    init () {
        //this.scene.input.on('pointerdown', (pointer) => this.shoot(pointer), this);
        //this.scene.input.on('pointerup', (pointer) => this.release(pointer), this);
        this.SPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.body.setDrag(300);
        this.body.setAngularDrag(400);
        this.body.setMaxVelocity(600);
    }

    shoot () {
        if (this.power > 0) {
            // this.getSpeeds();
            this.scene.playAudio("shot")
            this.scene.shots.add(new Shot(this.scene, this.x, this.y, this.speed_x, this.speed_y, this.id))
            this.power--;
        }
    }

    release(pointer) {
        if (pointer.leftButtonReleased()) {
            this.shooting = false;
        }
    }

    update () {
        if (this.death) return;
        if (this.cursor.left.isDown) {
            this.body.setAngularVelocity(-150);
        } else if (this.cursor.right.isDown) {
            this.body.setAngularVelocity(150);
        } else {
            this.body.setAngularVelocity(0);
        }
    
        if (this.cursor.up.isDown) {
            this.body.setVelocity(Math.cos(this.rotation) * 300, Math.sin(this.rotation) * 300);
            //this.scene.physics.velocityFromRotation(this.rotation, 200, this.body.acceleration);
        } else {
            this.body.setAcceleration(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
            this.shoot();
        }

        if (Phaser.Math.Between(1, 4) > 1) {
            this.scene.thrust.add(new Particle(this.scene, this.x , this.y , 0xffffff, 10))
            //new Particle(this.scene, this.x , this.y ,  50, -1)
            //new Particle(this.scene, this.x , this.y,  50, -1)
        }
    }

    update2 () {
        if (this.death) return;
        // Lerp rotation towards mouse
        this.getSpeeds()

            this.speed_x += Math.cos(this.rotation + Math.PI/2) * this.speed;
            this.speed_y += Math.sin(this.rotation + Math.PI/2) * this.speed;

            if (Phaser.Math.Between(1, 4) > 1) {
                this.scene.thrust.add(new Particle(this.scene, this.x , this.y , 0xffffff, 10))
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
        let dx = (this.scene.input.mousePointer.x + this.scene.cameras.main.worldView.x) - this.x;
        let dy = (this.scene.input.mousePointer.y + this.scene.cameras.main.worldView.y) - this.y;
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

export default Player;