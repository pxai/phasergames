import Obstacle from "./obstacle";

export default class ObstacleGenerator {
    constructor (scene) {
        this.scene = scene;
        this.init();
    }

    init () {
        this.scene.time.delayedCall(Phaser.Math.Between(2000, 3000), () => { this.generate() }, null, this);
    }

    generate() {
        switch (Phaser.Math.RND.pick([0, 1, 2])) {
            case 0:
                this.scene.obstacles.add(new Obstacle(this.scene, this.scene.player.x + 600, Phaser.Math.Between(0, 224), "tree"))
                break;
            case 1:
                this.scene.trees.add(new Obstacle(this.scene, this.scene.player.x + 600, this.scene.player.y + Phaser.Math.Between(-100, 100), "obstacle"))
                break;
            case 2:
                this.scene.obstacles.add(new Obstacle(this.scene, this.scene.player.x + 600, Phaser.Math.Between(600, 824), "tree"))
                break;
            default:
                break;
        }
        this.init();
    }
}
