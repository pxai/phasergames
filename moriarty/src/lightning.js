export default class Lightning {
    constructor(scene) {
        this.scene = scene;
    }

    lightning () {
        const timeline = this.scene.tweens.createTimeline();
        timeline.add({
            targets: this.scene.lightningEffect,
            alpha: { from: 0, to: 1},
            duration: 100,
            repeat: 3
          });

          timeline.add({
              targets: this.scene.lightningEffect,
              alpha: { from: 1, to: 0},
              duration: 1000,
          });

      timeline.play();
      this.scene.playRandom("thunder" + Phaser.Math.Between(0, 3))
    }
}