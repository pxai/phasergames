export default class Lights {
    constructor(scene) {
        this.scene = scene;
        this.out = false;
    }

    update () {
        if (Phaser.Math.Between(0, 101) > 100 && !this.out) {
            this.out = true;
            this.blackOut();
        }
    }

    blackOut () {
        console.log("Lights out");
        const timeline = this.scene.tweens.createTimeline();
        timeline.add({
            targets: this.scene.lightsOut,
            alpha: { from: 0, to: 1},
            duration: 200,
            repeat: 5
          });
        timeline.add({
          targets: this.scene.lightsOut,
          alpha: { from: 0, to: 1},
          duration: 100,
          repeat: 10
        });
        timeline.add({
            targets: this.scene.lightsOut,
            alpha: { from: 0, to: 1},
            duration: 1000,
          });

      timeline.play();
    }
}