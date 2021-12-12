import Dust from "./dust";

export default class Shot extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, veloX, veloY, name = "d6") {
        super(scene, x, y , "d6");
        this.setScale(0.5)
    
        this.scene = scene;
        this.name = name;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setOrigin(0.5);

        this.body.setVelocityX(veloX);
        this.body.setVelocityY(veloY);
    }

    destroy () {
        new Dust(this.scene, this.x, this.y)
        super.destroy();
    }
}
