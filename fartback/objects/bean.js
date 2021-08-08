class Bean extends Phaser.GameObjects.Sprite {
    constructor ({ scene, x, y, color }) {
        super(scene, x, y, "bean");
        this.scene = scene;
        this.setTween();
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.immovable = true;
        this.body.moves = false;
    
        const beanAnimation = this.scene.anims.create({
            key: "spin",
            frames: this.scene.anims.generateFrameNumbers("bean"),
            frameRate: 5
        });
        this.play({ key: "spin", repeat: -1 });

        this.tint = color;
        this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.touch, null, this.scene);
    }

    setTween () {
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            y: this.y - 20,
            repeat: -1,
            yoyo: true
        })   
    }

    touch (player, bean) {
        console.log("Touched!! ", player, bean);
        player.addGreenBean();
        bean.disable();
        this.regenerateId = setTimeout(() => {bean.enableAgain()}, 5000);
    }

    disable () {
        this.visible = false;
        this.overlap.active = false;
    } 

    enableAgain () {
        this.visible = true;
        this.overlap.active = true;
    }

    destroy() {
        super.destroy();
        clearTimeout(this.regenerateId);
    }
}

export default Bean;
