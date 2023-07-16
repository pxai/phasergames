import FoeShot from "./foe_shot";
import Explosion from "./explosion";

const TYPES = {
    "foe0": { points: 500 },
};

class Foe extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "foe0", velocityX = 0, velocityY = 0) {
        super(scene, x, y, name);
        this.name = name;
        this.points = TYPES[name].points;
        this.scene = scene;
        this.id = Math.random();
        this.spawnShadow(x, y)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setCircle(19);
        this.body.setOffset(12, 12);
        this.body.setVelocityX(velocityX);
        this.body.setVelocityY(velocityY);
        this.setData('vector', new Phaser.Math.Vector2());

        this.init();
   }

   spawnShadow (x, y) {
    this.shadow = this.scene.add.image(x + 20, y + 20, "foe0").setScale(0.7).setTint(0x000000).setAlpha(0.4)
   }

   updateShadow() {
        this.shadow.x = this.x + 20;
        this.shadow.y = this.y + 20;
   }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name),
            frameRate: 10,
            repeat: -1
          });
          
          this.anims.play(this.name, true)
          // this.body.setVelocityY(100);
          // this.body.setVelocityX(-Phaser.Math.Between(150, 200));
          this.direction = -1;
          // this.on('animationcomplete', this.animationComplete, this);

    }

    update () {
        if (Phaser.Math.Between(1, 101) > 100) {
            const players = this.scene.players.children.entries.length;
            if (players === 0) return;
            const player = this.scene.players.children.entries[0];
            let shot = new FoeShot(this.scene, this.x, this.y, "foe", this.name)
            this.scene.foeShots.add(shot);
            this.scene.physics.moveTo(shot, player.x, player.y, 300);
            this.scene.physics.moveTo(shot.shadow, player.x, player.y, 300);
        }

        this.updateShadow();
    }

    dead() {
        new Explosion(this.scene, this.x, this.y) 
        this.shadow.destroy();       
        super.destroy();
    }
}

export default Foe;
