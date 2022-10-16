class Shell  extends Phaser.GameObjects.Container {
    constructor (scene, x, y, name = "shell") {
        super(scene, x, y);
        this.scene = scene;
        this.name = name;
        this.setScale(0.9);
        //this.setOrigin(0, 1)


        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(32, 32)
        this.sprite = this.scene.add.sprite(0, 0 , "shell");
        this.shadow = this.scene.add.rectangle(8, 32, 16, 4, 0x000000);
        this.sprite.setOrigin(0)
        this.shadow.setOrigin(0)
        this.add(this.shadow);
        this.add(this.sprite);
        this.body.immovable = true;
        this.body.moves = false;
        this.disabled = false;
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames:  this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1
        });

        this.sprite.anims.play(this.name, true);
        this.scene.tweens.add({
            targets: this.sprite,
            duration: 500,
            y: this.sprite.y - 10,
            repeat: -1,
            yoyo: true
        })  

        this.scene.tweens.add({
            targets: this.shadow,
            duration: 500,
            scale: { from: 1, to: 0.5},
            repeat: -1,
            yoyo: true
        })  
    }

    pick () {
        const {x, y} = this.scene.cameras.main.getWorldPoint(this.scene.scoreCoinsLogo.x, this.scene.scoreCoinsLogo.y);

        this.disabled = true;
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            x: {from: this.x, to: x},
            y: {from: this.y, to: y},
            scale: {from: 0.7, to: 0.5},
            onComplete: () => { this.destroy()}
        })  
    }
}

export default Shell;
