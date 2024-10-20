import Obstacle from "./obstacle";
import Box from "./box";

export default class ObstacleGenerator {
    constructor (scene) {
        this.scene = scene;
        this.init();
    }

    init () {
        this.scene.time.delayedCall(Phaser.Math.Between(1000, 2000), () => { this.generate() }, null, this);
    }

    generate() {
        if (this.scene.player.accelerating) {
            switch (Phaser.Math.RND.pick([0, 1, 2, 4])) {
                case 0:
                    this.scene.trees.add(new Obstacle(this.scene, this.scene.player.x + 600, Phaser.Math.Between(0, 224), "tree"))
                    break;
                case 1:
                    this.scene.obstacles.add(new Obstacle(this.scene, this.scene.player.x + 600, this.scene.player.y + Phaser.Math.Between(-100, 100), "obstacle"))
                    break;
                case 2:
                    this.scene.trees.add(new Obstacle(this.scene, this.scene.player.x + 600, Phaser.Math.Between(600, 824), "tree"))
                    break;
                case 4:
                    if (Phaser.Math.Between(1, 5) > 4)
                        this.scene.boxes.add(new Box(this.scene, this.scene.player.x + 600, this.scene.player.y + Phaser.Math.Between(-100, 100)))
                    break;
                default:
                    break;
            }
        }

        this.init();
    }
}
