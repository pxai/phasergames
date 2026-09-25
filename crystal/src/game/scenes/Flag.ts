import { Scene, GameObjects, Physics } from 'phaser';

export default class Flag extends Physics.Arcade.Sprite {

    constructor(scene: Scene, x: number, y: number) {

        super(scene, x, y, "flag");
        this.scene = scene;
        this.name = "flag";
        scene.add.existing(this);

        //(scene as any).physics.add.existing(this);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        (this.body as Physics.Arcade.Body).immovable = true;
        (this.body as Physics.Arcade.Body).setImmovable(true);
        (this.body as Physics.Arcade.Body).setAllowGravity(false);

        console.log('Added flag!!');
        this.init();
    }

    init() {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.play(this.name, true);
    }

}
