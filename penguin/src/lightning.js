export default class Lightning {
    constructor(scene) {
        this.scene = scene;
    }

    lightning () {
        if (Phaser.Math.Between(1, 11) < 10) return;
        this.scene.time.delayedCall(Phaser.Math.Between(1000, 4000), () => this.dewIt(), null, this);
    }
    dewIt() {
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
              duration: 500
            });
          }
          timeline.add({
              targets: this.scene.lightningEffect,
              alpha: { from: 1, to: 0},
              duration: 2000,
          });
          if (this.scene.lights.out) {
            timeline.add({
              targets: this.scene.lightsOut,
              alpha: { from: 0.5, to: 1 },
              duration: 500,
            });
          }

      timeline.play();
      this.scene.cameras.main.shake(300);
      this.scene.playRandom("thunder" + Phaser.Math.Between(0, 3))
    }
}