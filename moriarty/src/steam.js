export class Steam {
    constructor (scene, x, y, width=12, height=12, type="down") {
        this.scene = scene;
        this.type = type;
        this.x = x + Phaser.Math.Between(-3, 3);
        this.y = y + Phaser.Math.Between(-3, 3);
        const changeSize = Phaser.Math.Between(-5, 0);
        width +=  changeSize;
        height +=  changeSize;

        let rect = this.scene.add.rectangle(x, y, width, height, 0xffffff, 1);
        this.scene.matter.add.gameObject(rect,  {density: 0.01})

        this.scene.tweens.add({
          targets: rect,
          duration: 500,
          scale: { from: 1, to: 2},
          alpha: { from: 1, to: 0},
          onComplete: () => {
            rect.destroy();
          }
        })
     }
  }

  export class SteamBurst {
    constructor (scene, x, y, isRight=true, width=16, height=16) {
        this.scene = scene;
        const changeSize = Phaser.Math.Between(-5, 0);
        width +=  changeSize;
        height +=  changeSize;

        let rect = this.scene.add.rectangle(x, y, width, height, 0xffffff, 1);
        this.scene.matter.add.gameObject(rect,  {density: 0.01})
        rect.applyForce({x: isRight ? -0.08 : 0.08, y: -0.03})
        this.scene.tweens.add({
          targets: rect,
          duration: 500,
          scale: { from: 1, to: 2},
          alpha: { from: 1, to: 0},
          onComplete: () => {
            rect.destroy();
          }
        })
     }
  }

  export class FireBurst {
    constructor (scene, x, y, isRight=true, width=6, height=6) {
        this.scene = scene;
        const color = Phaser.Math.RND.pick([0xff0000, 0xff5a00, 0xff9a00, 0xffce00, 0xffe808])
        let rect = this.scene.add.rectangle(x, y, width, height, color);
        this.scene.matter.add.gameObject(rect,  {density: 0.01})
        rect.applyForce({x: isRight ? -0.08 : 0.08, y: -0.03})
        this.scene.tweens.add({
          targets: rect,
          duration: 500,
          alpha: { from: 1, to: 0},
          onComplete: () => {
            rect.destroy();
          }
        })
     }
  }

  export class FireTongue {
    constructor (scene, x, y, isRight=true) {
        this.scene = scene;
        this.x = x - 256;
        this.y = y;
        this.sprite = this.scene.matter.add.sprite(x, y, "fireburst", {isStatic: true});
        this.sprite.label = "fireburst";
        const offset = isRight ? 256 : -256; 
        this.scene.tweens.add({
          targets: this.sprite,
          duration: 500,
          x: {from: this.x, to: this.x + 256},
          onComplete: () => {
            this.sprite.destroy();
          }
        })

        this.scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
            const player = bodyA.label === "player" ? bodyA : bodyB;

            if (bodyA.label === "fireburst" && player?.label === "player") {

                //this.scene.finishScene();
            }
        });
     }
  }
  
  