export class Smoke extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, width, height, color = 0xffffff, gravity = false) {
        width = width || Phaser.Math.Between(10, 25);
        height = height || Phaser.Math.Between(10, 25);
        super(scene, x, y, width, height, color);
        scene.add.existing(this);
        this.scene = scene;
        this.color = color;
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 800,
            scale: { from: 1, to: 0 },
            onComplete: () => { this.destroy(); }
        });
    }
}

// 0xa13000 red brick
// 0xb03e00 orange brick
// 0xb06f00 golden brick
// 0x4d4d4d grey brick

export class RockSmoke extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, width, height, color = 0xFFEAAB, gravity = false) {
        width = width || Phaser.Math.Between(30, 55);
        height = height || Phaser.Math.Between(30, 55);
        super(scene, x, y, width, height, color);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setVelocityY(-100);
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 800,
            scale: { from: 1, to: 0 },
            onComplete: () => { this.destroy(); }
        });
    }
}

export class Glitter extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, min = 1, max = 1, color = 0xffffff) {
        const width = Phaser.Math.Between(min, max);
        super(scene, x, y, width, width, color);
        scene.add.existing(this);
        this.scene.tweens.add({
            targets: this,
            duration: 800,
            scale: { from: 1, to: 0 },
            onComplete: () => { this.destroy(); }
        });
    }
}

export class JumpSmoke extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, width, height, color = 0xFFEAAB, gravity = false) {
        width = width || Phaser.Math.Between(10, 25);
        height = height || Phaser.Math.Between(10, 25);
        super(scene, x, y, width, height, color);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setVelocityX(Phaser.Math.Between(-20, 20));
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 800,
            scale: { from: 1, to: 0 },
            onComplete: () => { this.destroy(); }
        });
    }
}

export class Debris extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, color = 0xb03e00, width, height, gravity = false) {
        width = width || Phaser.Math.Between(15, 30);
        height = height || Phaser.Math.Between(15, 30);
        super(scene, x, y + 5, width, height, color);
        // this.setStrokeStyle(4, 0x000000);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(true);
        this.body.setVelocityX(Phaser.Math.Between(-50, 50));
        this.body.setVelocityY(width * height);
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 400,
            scale: { from: 1, to: 0 },
            onComplete: () => { this.destroy(); }
        });
    }
}

export class Rock extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "rock", 0);
        // this.setStrokeStyle(4, 0x000000);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(24, 24);
        this.body.setAllowGravity(true);
        this.body.immovable = true;
        this.falling = true;
        this.init();
    }

    init () {
    }
}

export class Gold extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "rock", Phaser.Math.RND.pick([9, 10, 11, 12]));
        // this.setStrokeStyle(4, 0x000000);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.immovable = true;

        this.init();
    }

    init () {
        this.scene.events.on("update", this.update, this);
        this.scene.tweens.add({
            targets: this,
            duration: 300,
            repeat: -1,
            scale: { from: 0.95, to: 1 },
            yoyo: true
        });
    }

    update () {
        if (this.active && Phaser.Math.Between(0, 10) > 8) { new Glitter(this.scene, Phaser.Math.Between(this.x - 18, this.x + 18), Phaser.Math.Between(this.y - 18, this.y + 18), 3, 5); }
    }
}

export const elements = {
    gold: { color: 0xb06f00, hits: 5, points: 1000, rate: 0.8 },
    orange: { color: 0xb03e00, hits: 1, points: 10, rate: 1.1 },
    ruby: { color: 0xa13000, hits: 15, points: 2000, rate: 0.7 },
    silver: { color: 0x4d4d4d, hits: 10, points: 500, rate: 0.9 },
    oil: { color: 0x444444, hits: 10, points: 500, rate: 1 }
};
