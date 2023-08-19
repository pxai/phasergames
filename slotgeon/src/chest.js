class Chest extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y ) {
        super(scene, x, y, "chest");
        this.scene = scene;
        scene.add.existing(this);
        this.coins = Phaser.Math.Between(10, 50);
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "chestidle",
            frames: this.scene.anims.generateFrameNumbers("chest", { start: 0, end: 0 }),
            frameRate: 3,
            repeat: -1
        });
    
        this.scene.anims.create({
            key: "chestopen",
            frames: this.scene.anims.generateFrameNumbers("chest", { start: 0, end: 2 }),
            frameRate: 5,
        });

        this.anims.play("chestidle", true);
        //this.setTween()

    }

    setTween () {
        this.chestTween = this.scene.tweens.add({
            targets: this,
            duration: 500,
            scaleY: {from: 1, to: 1.2},
            repeat: -1,
            yoyo: true
        })   
    }

   open() {
        this.anims.play("chestopen", true);
   }
}

export default Chest;
