class RedBean extends Phaser.GameObjects.Sprite {
    constructor ({ scene, x, y, color }) {
        super(scene, x, y, "redbean");
        this.scene = scene;
        this.setTween();
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.immovable = true;
        this.body.moves = false;
    
        const beanAnimation = this.scene.anims.create({
            key: "redspin",
            frames: this.scene.anims.generateFrameNumbers("redbean"),
            frameRate: 5
        });
        this.play({ key: "redspin", repeat: -1 });

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

        player.addRedBean();
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

export default RedBean;
