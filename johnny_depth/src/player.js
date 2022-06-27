import Shot from "./shot";
import { Bubble } from "./bubble";

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "johnny", limited = true) {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.setOrigin(0.5);
        this.setScale(0.7)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(true);
        this.body.setCircle(22);
        this.defaultVelocity = 300;
        this.body.setDrag(this.defaultVelocity/2)
        this.body.setBounce(1);
        this.moving = false;
        this.right = true;
        this.limited = limited;
        this.health = 100;
        this.isHit = false;
        this.latestX = 0;
        this.latestY = 0;
        
        this.init();
        this.setKeys()
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.light = this.scene.lights.addLight(this.x - 16, this.y, 50).setColor(0xffffff).setIntensity(3.0);
        this.scene.anims.create({
            key: this.name + "move",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 1, end: 1 }),
            frameRate: 2,
            repeat: 2
        });

        this.anims.play(this.name, true);
        this.scene.events.on("update", this.update, this);
        this.on('animationcomplete', this.animationComplete, this);
        this.on("animationupdate" , this.animationUpdate, this);
    }

    setKeys () {
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.scene.input.mouse.disableContextMenu();
        this.scene.input.on('pointerdown', (pointer) => this.handleClick(pointer), this);
        this.scene.input.on('pointerup', (pointer) => this.removeAttractor(pointer), this);
    }

    handleClick (pointer) {
        if (this.health < 0 || this.attractor) return;
        this.attractor = {x: pointer.worldX, y: pointer.worldY}
        if (pointer.rightButtonDown()) {
          //this.playAudio("repel");

          this.shot(this.attractor);
        } else {
          //this.playAudio("atract");
          this.move(this.attractor);
        }
      }

    move(position) {
        console.log("Move: ", position)
        const point = new Phaser.Geom.Point(position.x, position.y);
        const distance = 1 //Phaser.Math.Distance.BetweenPoints(this, point) / 100;
        this.moving = true;
        this.anims.play(this.name+"move", true);
        
        this.setScale(0.5, 1)
        this.scene.playBubble();
        
        Array(Phaser.Math.Between(6, 10)).fill(0).forEach(i => {
            this.scene.trailLayer.add(new Bubble(this.scene, this.x + (Phaser.Math.Between(-10, 10)) , this.y + (Phaser.Math.Between(-10, 10)),  50, 1, 600, 0x0099dc))
        })
        this.scene.physics.moveTo(this, position.x, position.y, this.defaultVelocity / distance);
    }

    dash() {
        console.log("DASH: ", this.latestX, this.latestY, this.dx, this.dy, ((Math.abs(this.dy) + Math.abs(this.dx)) % 200))
       // const point = new Phaser.Geom.Point(this.latestX, this.latestY);
        //const distance = 1 //Phaser.Math.Distance.BetweenPoints(this, point) / 100;
        this.anims.play(this.name+"move", true);
        this.setScale(0.5, 1)
        this.moving = true;
        console.log("Previous health: " + this.health, (Math.round((Math.abs(this.dy)/50 + Math.abs(this.dx)/50))));
        this.health = this.health - 5 - (Math.round((Math.abs(this.dy)/50 + Math.abs(this.dx)/50)));
        
        this.scene.playBubble();
        console.log("Next health: " + this.health)
        this.scene.updateHealth(this.health)
        Array(Phaser.Math.Between(6, 10)).fill(0).forEach(i => {
            this.scene.trailLayer.add(new Bubble(this.scene, this.x + (Phaser.Math.Between(-10, 10)) , this.y + (Phaser.Math.Between(-10, 10)),  50, 1, 600, 0x0099dc))
        })
        this.body.setVelocityX(this.dx * 3);
        this.body.setVelocityY(this.dy * 3)

        //this.scene.physics.moveTo(this, this.latestX, this.latestY, this.defaultVelocity * 2);
    }



    shot(position) {
        const point = new Phaser.Geom.Point(position.x, position.y);
        this.scene.playBubble();
        this.scene.playAudio("fireball", 0.6)
        const fireball = new Shot(this.scene, this.x, this.y, 0.7) ;
        this.health -= 10;
        this.scene.updateHealth(this.health)
        this.scene.fireballs.add(fireball)
        const distance = Phaser.Math.Distance.BetweenPoints(this, point) / 100;
       this.scene.physics.moveTo(fireball, point.x, point.y, 300);
    }
  
      removeAttractor (pointer) {
        if (!this.attractor) return;
        this.attractor = null;
      }

    up () {
        if (this.upTween) return;
        this.upTween = this.scene.tweens.add({
            targets: this,
            duration: 400,
            yoyo: true,
            scaleY: {from: 1, to: 0.9},
            repeat: -1
        })
    }

    update () {
        if (!this.scene || this.health < 0) return;
        if (Phaser.Math.Between(0, 6) > 4 && this.moving)
            this.scene.trailLayer.add(new Bubble(this.scene, this.x + (Phaser.Math.Between(-4, 4)) , this.y + (Phaser.Math.Between(-4, 4)),  50, 1, 600, 0x0099dc))

    

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.dash();
        }

        if (Phaser.Input.Keyboard.JustDown(this.S)) {
            this.scene.skip();
        }

        this.getSpeeds();
        this.scene.playerLight.x = this.x;
        this.scene.playerLight.y = this.y;
    }

    getSpeeds () {
        this.latestX = this.scene.input.mousePointer.x;
        this.latestY = this.scene.input.mousePointer.y;
        this.dx = (this.scene.input.mousePointer.x + this.scene.cameras.main.worldView.x) - this.x;
        this.dy = (this.scene.input.mousePointer.y + this.scene.cameras.main.worldView.y) - this.y;
        let angle = Math.atan2(this.dy, this.dx) - Math.PI/2;
        let dir = (angle - this.rotation) / (Math.PI * 2);
        dir -= Math.round(dir);
        dir = dir * Math.PI * 2;

        this.newSpeed = (Math.abs(this.dx) + Math.abs(this.dy)/2)/100
        this.body.rotation += dir * 100
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "wendy", score, 40, color).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 1000,
            alpha: {from: 1, to: 0},
            y: {from: this.y - 10, to: this.y - 60},
            onComplete: () => {
                text.destroy()
            }
        });
    }

    showStreakPoints (streak, color = 0x00ff00) {
        this.scene.playAudio("streak")
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "wendy", "BONUS x" + streak, 40, color).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 2000,
            alpha: {from: 1, to: 0},
            y: {from: this.y - 10, to: this.y - 100},
            onComplete: () => {
                text.destroy()
            }
        });
    }

    hitGround () {
        this.body.setVelocityX(0);
        this.body.setVelocityY(-400);
        new Dust(this.scene, this.x, this.y - 4, "0x902406")
    }

    pickEmber () {
        const health = Phaser.Math.Between(1, 10);
        this.health = health + this.health > 100 ? 100 : health + this.health;
        this.showPoints("+"+health);
    }

    hit (score = 0) {
        this.isHit = true;
        this.scene.cameras.main.shake(100);
        this.scene.bubbleExplosion(this.x, this.y)
        this.health--;
        this.showPoints("-1", 0xcb0000);
        this.scene.updateHealth(this.health)

        if (this.health < 0) {
            this.scene.gameOver();
        } else {
            this.scene.tweens.add({
                targets: this,
                duration: 200,
                alpha: {from: 0, to: 1},
                repeat: 5,
                onComplete: () => {
                    this.isHit = false
                }
            });
        }
    }


    animationComplete(animation, frame) {
        if (animation.key === this.name + "move") {
            this.moving = false;
            this.setScale(0.7)
            this.anims.play(this.name, true);
        }
    }

    animationUpdate(animation, frame, avocado) {
        // super.animationUpdate(animation, frame, avocado)
        if(animation.key === this.name + "move" && frame.index === 1) {
            this.setScale(0.7)
        }
    }
}

export default Player;