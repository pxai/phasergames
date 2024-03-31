export default class GustGenerator {
    constructor(scene){
        this.scene = scene;

        this.gusts = [];
        this.generate();
    }

    generate () {
        this.addGust();
        this.timer = this.scene.time.addEvent({ delay: 1500, callback: this.addGust, callbackScope: this, loop: true });
    }

    stop () {
        this.timer.remove();
        this.stopped = true;
    }

    addGust (x = 800, y) {
        this.left = Phaser.Math.RND.pick([0, 800])
        const velocity = Phaser.Math.Between(50, 150) * (this.left === 0 ? 1 : -1);
        const gust = new Gust(this.scene, this.left, this.scene.player.y + Phaser.Math.Between(-200, 200), velocity);
        this.scene.gusts.add(gust);
        this.gusts.push(gust);
    }

    update () {
       this.gusts.forEach( gust => {
           if (gust.x < -100 || gust.x > 800) gust.destroy();
       })
       this.gusts = this.gusts.filter(gust => gust.active);
    }
}

class Gust extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, velocity = 100) {
        super(scene, x, y, 32, Phaser.Math.Between(64, 256), 0x000000);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setAlpha(0);
        this.body.setAllowGravity(false);
        this.body.setVelocityX(velocity);
        this.scene.time.delayedCall(5000, () => { this.destroy(); });
    }
}