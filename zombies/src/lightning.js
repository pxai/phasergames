export default class Lightning {
    constructor(scene) {
        this.scene = scene;
      // this.lightning();
    }

    lightning () {
      this.scene.time.delayedCall(Phaser.Math.Between(20000, 30000), () => this.lightning(), null, this);
    }

    dewIt() {
      //console.log("LEts dew it: ", this.scene.tweens.createTimeline, typeof this.scene.tweens.createTimeline)
       // const timeline = this.scene.tweens.createTimeline();
        this.scene.tweens.add({
            targets: this.scene.lightningEffect,
            alpha: { from: 0, to: 1},
            duration: 100,
            repeat: 3,
            onComplete: ()=> {
              this.scene.tweens.add({
                targets: this.scene.lightningEffect,
                alpha: { from: 1, to: 0},
                duration: 2000,
            });
            }
          });
          if (this.scene.lights.out) {
            this.scene.tweens.add({
              targets: this.scene.lightsOut,
              alpha: { from: 1, to: 0.5 },
              duration: 500
            });
          }

          if (this.scene.lights.out) {
            this.scene.tweens.add({
              targets: this.scene.lightsOut,
              alpha: { from: 0.5, to: 1 },
              duration: 500,
            });
          }

     // timeline.play();  
      this.scene.playAudioRandomly("thunder" + Phaser.Math.Between(0, 3))
      this.scene.time.delayedCall(Phaser.Math.Between(10000, 20000), () => this.dewIt(), null, this);
    }
}