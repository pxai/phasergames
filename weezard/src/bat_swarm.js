import Bat from "./bat";

class BatSwarm {
    constructor (scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.bats = Array(50).fill(0).map(i => new Bat(this.scene, this.x, this.y))


        this.bats.forEach((bat, i) => {
            let x = (Phaser.Math.Between(-1, 1) > 0 ? 1 : -1 )* Phaser.Math.Between(9800, 11200);
            let y = (Phaser.Math.Between(-1, 1) > 0 ? 1 : -1 ) * Phaser.Math.Between(9800, 11200);
            this.tweenBat(i, x, y)
        })
    }

    tweenBat(i, x, y) {
        this.scene.tweens.add({
            targets: this.bats[i],
            duration: Phaser.Math.Between(30000, 36000),
            y: {from: this.y + Phaser.Math.Between(-200, 200), to: this.y + y},
            x: {from: this.x + Phaser.Math.Between(-200, 200), to: this.x + x},
        })
    }
}

export default BatSwarm;