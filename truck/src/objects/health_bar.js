export default class HealthBar {

    constructor (ship, x, y, value)
    {
        this.bar = new Phaser.GameObjects.Graphics(ship.scene);

        this.x = x;
        this.y = y;
        this.value = value;
        this.p = 76 / 100;

        this.draw();
        this.bar.setAlpha(0)
        ship.add(this.bar);
    }

    decrease (amount)
    {
        this.value -= (amount);

        if (this.value < 0) {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw () {
        this.bar.clear();
        let color = 0x00ff00;
        if (this.value > 30 && this.value < 60) {
            color = 0xffa500;
        } else if (this.value <= 30) {
            color = 0xff0000;
        }

        this.bar.fillStyle(color);
        this.bar.fillRect(this.x, this.y, 80, 16);

        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);
        this.bar.fillStyle(color);
        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

}