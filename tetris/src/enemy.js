export default class Enemy extends Phaser.GameObjects.GameObject {
    constructor (scene, x, y) {
        super(scene, x, y);

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        // this.body.setImmovable(true);

        this.blocks = this.scene.physics.add.staticGroup();
        this.createRandomShape();

        // this.init();
        this.defaultVelocity = 1000;
        this.body.setDrag(12500);
        this.resolved = false;
    }

    createRandomShape () {
        Phaser.Math.RND.pick([
            this.createL.bind(this),
            this.createI.bind(this),
            this.createS.bind(this),
            this.createT.bind(this),
            this.createZ.bind(this)
        ])();
    }

    createShape (positions) {
        this.addBlocks(positions, "block_black");
    }

    createL () {
        const positions = [{ x: this.x, y: this.y }, { x: this.x + 32, y: this.y }, { x: this.x + 64, y: this.y }, { x: this.x + 64, y: this.y - 32 }];

        this.createShape(positions);
    }

    createS () {
        const positions = [{ x: this.x, y: this.y }, { x: this.x + 32, y: this.y }, { x: this.x + 32, y: this.y - 32 }, { x: this.x + 64, y: this.y - 32 }];

        this.createShape(positions);
    }

    createZ () {
        const positions = [{ x: this.x, y: this.y - 32 }, { x: this.x + 32, y: this.y - 32 }, { x: this.x + 32, y: this.y }, { x: this.x + 64, y: this.y }];

        this.createShape(positions);
    }

    createI () {
        const positions = [{ x: this.x, y: this.y }, { x: this.x + 32, y: this.y }, { x: this.x + 64, y: this.y }, { x: this.x + 96, y: this.y }];

        this.createShape(positions);
    }

    createT () {
        const positions = [{ x: this.x, y: this.y }, { x: this.x + 32, y: this.y }, { x: this.x + 32, y: this.y - 32 }, { x: this.x + 64, y: this.y }];

        this.createShape(positions);
    }

    addBlocks (positions, color) {
        positions.forEach(position => {
            const { x, y } = position;
            const block = this.scene.physics.add.sprite(x, y, color);
            block.setOrigin(0, 0)
                .setPushable(false)
                .setImmovable(true)
                .setGravity(0)
                .refreshBody();

            // const block = new Phaser.GameObjects.Sprite(this.scene, x, y, color).setOrigin(0.5);
            // this.scene.add.existing(block) // Apparently mecessary if you want to animate
            // this.scene.physics.add.existing(block);
            block.body.setAllowGravity(false);
            this.scene.figures.add(block);
            this.blocks.add(block);
        });
    }

    update () {

    }
}
