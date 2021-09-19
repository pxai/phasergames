export default class Lightning {
    constructor(scene) {
        this.scene = scene;
    }

    update () {
        if (Phaser.Math.Between(0, 1001) > 1000) {
            this.lightning();
        }
    }

    lightning () {
        console.log("Lightning");
        const timeline = this.scene.tweens.createTimeline();
        timeline.add({
            targets: this.scene.lightningEffect,
            alpha: { from: 0, to: 1},
            duration: 100,
            repeat: 3
          });
          if (this.scene.lights.out) {
            timeline.add({
              targets: this.scene.lightsOut,
              alpha: { from: 1, to: 0.5 },
              duration: 1000,
            });
          }
          timeline.add({
              targets: this.scene.lightningEffect,
              alpha: { from: 1, to: 0},
              duration: 2000,
          });

      timeline.play();
      this.scene.playRandom("thunder" + Phaser.Math.Between(0, 3))
    }
}