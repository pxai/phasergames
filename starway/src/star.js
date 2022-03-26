/*import StarBurst from "./starburst";
import { Particle } from "./particle";*/

export default class Star extends Phaser.GameObjects.Container {
    constructor (scene, star = "") {
        super(scene, star.x, star.y);
        this.x = star.x;
        this.y = star.y;
        this.scene = scene;

        this.scene.add.existing(this);
        console.log("Adding star: ", star)
        this.sprite = new Phaser.GameObjects.Sprite(this.scene, star.x, star.y, star.sprite).setScale(star.scale).setOrigin(0.5);
        this.add(this.sprite);

        this.setInteractive();
    }
}