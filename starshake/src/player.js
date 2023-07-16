import Explosion from "./explosion";
import Particle from "./particle";
import ShootingPatterns from "./shooting_patterns";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "player1", powerUp = "water") {
        super(scene, x, y, name);
        this.name = name;
        this.scene = scene;
        this.spawnShadow(x, y)
        this.powerUp = powerUp;
        this.id = Math.random();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        this.body.setCircle(26);
        this.body.setOffset(6, 9)
        this.power = 0;
        this.blinking = false;
        this.shootingPatterns = new ShootingPatterns(this.scene, this.name);
        this.init();
    }

    spawnShadow (x, y) {
        this.shadow = this.scene.add.image(x + 20, y + 20, "player1").setTint(0x000000).setAlpha(0.4)
    }

    init () {
        this.SPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        this.upDelta = 0;
    }

    shoot () {
      this.shootingPatterns.shoot(this.x, this.y, this.powerUp)
    }

    release(pointer) {
        if (pointer.leftButtonReleased()) {
            this.shooting = false;
        }
    }

    update (timestep, delta) {
        if (this.death) return;
        if (this.cursor.left.isDown) {
            this.x -= 5;
        } else if (this.cursor.right.isDown) {
            this.x += 5;
        }
    
        if (this.cursor.up.isDown) {
            this.y -= 5;
        } else if (this.cursor.down.isDown) {
            this.y += 5;
        }

        if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
            this.shoot();
        }

        this.updateShadow();
    }

    updateShadow() {
        this.shadow.x = this.x + 20;
        this.shadow.y = this.y + 20;
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

    dead () {
        this.scene.cameras.main.shake(500);
        this.death = true;
        this.shadow.destroy();
        new Explosion(this.scene, this.x, this.y, 40)
        super.destroy();
    }     
}

export default Player;