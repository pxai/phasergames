class Chest extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "chest") {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.setScale(1.2);
        this.setOrigin(0.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.immovable = true;
        //this.body.moves = false;
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

        this.anims.play(this.name, true);
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            scale: { from: 0.9, to: 1},
            repeat: -1,
            yoyo: true
        })  
    }

    pick () {
        this.anims.play(this.name + "opened", true);
        this.showPrize()
        this.disabled = true;
        this.scene.time.delayedCall(1000, () => { 
            this.destroy()
            this.prizeSprite.destroy();
        }, null, this);
    }

    showPrize () {
        const prize = ["gold", "whisky", "tnt", "boots", "remote"];
        const selectedPrize = Phaser.Math.RND.pick(prize);
        this.scene.player.applyPrize(selectedPrize)
        this.prizeSprite = this.scene.add.sprite(this.x, this.y, selectedPrize).setOrigin(0.5).setScale(0.8);
        this.scene.tweens.add({
            targets: this.prizeSprite,
            duration: 500,
            y: {from: this.y, to: this.y - 64},
            onComplete: () => {
                //this.scene.playAudio("prize")
            }
        })
    }
}

export default Chest;
