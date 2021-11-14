import Sand from "./sand";

class Shell extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "shell", redirectX = 100) {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.redirectX = redirectX;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.body.immovable = true;
        this.body.moves = false;
        this.body.setSize(32, 10)
        this.body.y -= 10;
        console.log(this.rotation)
        this.init();
    }

    init () {
        this.rotateTween = this.scene.tweens.add({
            targets: this,
            duration: 500,
            rotation: {from: -0.2, to: 0.2},
            repeat: -1,
            yoyo: true
        })  
    }

    touched (crab) {
        //this.rotateTween.stop();
        const timeline = this.scene.tweens.createTimeline();
        timeline.add({
            targets: this,
            duration: 150,
            y: {from: this.y, to: this.y + 10},
        });
        timeline.add({
            targets: this,
            duration: 300,
            y: {from: this.y, to: this.y - 10},
            onComplete: () => crab.redirect(this)
        })  
        timeline.play();
        Array(Phaser.Math.Between(8, 15)).fill(0).forEach( (sand, i) => {
            new Sand(this.scene, this.x, this.y, Phaser.Math.Between(-10, 10))
        });
    }
}

export default Shell;