class StarBurst {
    constructor (scene, x, y, color = "0xffffff", launch = false, multi = false) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.launch = launch;
        this.color = Phaser.Display.Color.HexStringToColor(color).color;
        this.stars = Array(this.launch ? 11 : 5).fill(0).map(i => {
            let image = this.scene.add.image(this.x, this.y - 2, "shaken").setScale(2);
            return image;
        })

        this.tweenStar(0, -100);
        this.tweenStar(1, -50)
        this.tweenStar(2);
        this.tweenStar(3, 50);
        this.tweenStar(4, 100);
        if (this.launch) {
            this.tweenStar(5, -50, 0);
            this.tweenStar(6, 50, 0)
            this.tweenStar(7, -75, 30);
            this.tweenStar(8, 75, 30)
            this.tweenStar(9, -100, 70);
            this.tweenStar(10, 100, 70)
        }
    }

    tweenStar(i, x = 0, y = -70) {
        const scale = this.launch ? 1 : 1.2
        this.scene.tweens.add({
            targets: this.stars[i],
            duration: Phaser.Math.Between(3000, 6000),
            y: {from: this.y, to: this.y + y + 5},
            x: {from: this.x, to: this.x + x + 5},
            scale: scale,
            alpha: {from: 1, to: 0},
            rotation: "+=5"
        });
    }
}

export default StarBurst;