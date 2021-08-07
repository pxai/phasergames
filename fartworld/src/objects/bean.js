class Bean extends Phaser.GameObjects.Sprite {
    constructor ({ scene, x, y, color }) {
        super(scene, x, y, "bean");
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.immovable = true;
        this.body.moves = false;
        scene.physics.add.overlap(this.scene.player, this, () => this.touch(), null, scene);
        // const bean = this.scene.add.sprite(300, 200, 'bean');

        const beanAnimation = this.scene.anims.create({
            key: "spin",
            frames: this.scene.anims.generateFrameNumbers("bean"),
            frameRate: 5
        });
        this.play({ key: "spin", repeat: -1 });

        this.tint = color;
        //  scene.physics.add.collider(scene.platforms, this, () => this.touch(), null, scene);
    }

    touch (player, bean) {
        // console.log("Touched!! ", player, bean);
    }
}

export default Bean;
