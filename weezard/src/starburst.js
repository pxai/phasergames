class StarBurst {
    constructor (scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.stars = Array(7).fill(0).map(i => this.scene.add.image(this.x, this.y - 2, "star", 0xffffff, 1))
        this.tweenStar(0, -150);
        this.tweenStar(1, -100);
        this.tweenStar(2, -50)
        this.tweenStar(3);
        this.tweenStar(4, 50);
        this.tweenStar(5, 100);
        this.tweenStar(6, 150)
    }

    tweenStar(i, x = 0) {
        this.scene.tweens.add({
            targets: this.stars[i],
            duration: Phaser.Math.Between(300, 600),
            y: {from: this.y, to: this.y - 70},
            x: {from: this.x, to: this.x + x},
            scale: {
                from: 1,
                to: Phaser.Math.Between(0.5, 1)
              },
            alpha: { from: 1, to: 0 }
        });
        console.log("Star!!");
    }
}

export default StarBurst;