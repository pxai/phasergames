export class Smoke extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, width, height, color = 0xffffff, gravity = false ) {
        width = width || Phaser.Math.Between(10, 25)
        height = height || Phaser.Math.Between(10, 25)
        super(scene, x, y, width, height, color)
        scene.add.existing(this)
        this.scene = scene;
        this.color = color;
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 800,
            scale: {from: 1, to: 0},
            onComplete: () => { this.destroy()  }
        });

    }
}

// 0xa13000 red brick
// 0xb03e00 orange brick
// 0xb06f00 golden brick
// 0x4d4d4d grey brick

export class RockSmoke extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, width, height, color = 0xFFEAAB, gravity = false ) {
        width = width || Phaser.Math.Between(30, 55)
        height = height || Phaser.Math.Between(30, 55)
        super(scene, x, y, width, height, color)
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setVelocityY(-100);
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 800,
            scale: {from: 1, to: 0},
            onComplete: () => { this.destroy()  }
        });

    }
}

export class Debris extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, color = 0xb03e00,  width, height, gravity = false ) {
        width = width || Phaser.Math.Between(15, 30)
        height = height || Phaser.Math.Between(15, 30)
        super(scene, x, y + 5, width, height, color)
        this.setStrokeStyle(4, 0x000000);
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(true);
        this.body.setVelocityX(Phaser.Math.Between(-100, 100));
        // this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 800,
            scale: {from: 1, to: 0},
            onComplete: () => { this.destroy()  }
        });

    }
}

export const elements = {
    "gold": { color: 0xb06f00, hits: 5, points: 1000, rate: 0.8 },
    "orange": { color: 0xb03e00, hits: 1, points: 10, rate: 1.1 },
    "ruby":  { color: 0xa13000, hits: 15, points: 2000, rate: 0.7 },
    "silver":  { color: 0x4d4d4d, hits: 10, points: 500, rate: 0.9 },
    "oil":  { color: 0x444444, hits: 10, points: 500, rate: 1 }
};
