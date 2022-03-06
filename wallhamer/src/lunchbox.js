class LunchBox extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "lunchbox") {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.setScale(1);
        this.setOrigin(0.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.immovable = true;
        this.body.moves = false;
        this.disabled = false;
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames:  this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 0 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: this.name + "opened",
            frames:  this.scene.anims.generateFrameNumbers(this.name, { start: 1, end: 1 }),
            frameRate: 1,
        }); 

        console.log("Animating: ", this.name)
        this.anims.play(this.name, true);
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            y: this.y - 20,
            repeat: -1,
            yoyo: true
        })  
    }

    pick () {
        this.anims.play(this.name + "opened", true);
        console.log("pick!")
        this.disabled = true;
        this.scene.time.delayedCall(500, () => { this.destroy()}, null, this);
    }
}

export default LunchBox;
