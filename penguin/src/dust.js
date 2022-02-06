class Dust {
    constructor (scene, x, y, color = "0xffffff", launch = false) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.launch = launch;
        this.color = Phaser.Display.Color.HexStringToColor(color).color;
        const colors = [ 0xffffff, 0x64a7bd, 0x3e6875];
        this.dust = Array(11).fill(0).map(i => {
            let rectangle = this.scene.add.rectangle(this.x, this.y, 10, 10, colors[Phaser.Math.Between(0, 2)]);
            return rectangle;
        })

        this.tweenStar(0, -20);
        this.tweenStar(1, -15)
        this.tweenStar(2);
        this.tweenStar(3, 15);
        this.tweenStar(4, 30);
        this.tweenStar(5, -15, 0);
        this.tweenStar(6, 15, 0)
        this.tweenStar(7, -17.5, 3);
        this.tweenStar(8, 17.5, 3)
        this.tweenStar(9, -20, 7);
        this.tweenStar(10, 20, 7)
    }

    tweenStar(i, x = 0, y = -10) {
        this.scene.tweens.add({
            targets: this.dust[i],
            duration: Phaser.Math.Between(500, 800),
            y: {from: this.y + 20, to: this.y + 20 - y},
            x: {from: this.x, to: this.x + x},
            alpha: { from: 1, to: 0 },
            onComplete: () => { this.dust[i].destroy();}
        });
    }
}

export default Dust;