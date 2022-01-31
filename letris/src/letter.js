
export default class Letter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, letter, image = "letter") {
        super(scene, x, y, image);
        this.setOrigin(0.5);
        this.letter = this.scene.add.bitmapText(scene, x, y, "pixelFont", letter, 30).setOrigin(0.5);


        //this.add(this.text);
        //this.add(this.frame);
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.scene.add.existing(this);

        this.init();
    }

    init () {

    }
}