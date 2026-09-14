import { Scene, Math, Physics } from 'phaser';




export default class Sheep extends Physics.Arcade.Sprite {
    public touched: boolean;

    constructor(scene: Scene, x: number, y: number) {

        super(scene, x, y, "sheep");
        this.name = "sheep";
        scene.add.existing(this);

        //(scene as any).physics.add.existing(this);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        (this.body as Physics.Arcade.Body).setAllowGravity(false);
        this.body!.setCircle(24);
        this.body!.setOffset(6, 12);
        console.log('Added sheep!!');
        this.init();
    }


    init() {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: 2
        });
    }

    update () {

    }

    setTouched () {
        this.touched = true;
        this.setTint(0x72751b);
    }

    walk (direction: string) {

        if (this.touched) {
            this.anims.stop();
            this.body?.stop();
            return;
        }
        const VELOCITY = Math.Between(20, 35);
        const DRAG = 15;
        this.anims.play(this.name, true);
        switch (direction) {
            case "down":
                this.body.setVelocityY(VELOCITY)
                this.body.setDragY(DRAG)
                break;
            case "up":
                this.body.setVelocityY(-VELOCITY)
                this.body.setDragY(DRAG)
                break;
            case "left":
                this.flipX = true;
                this.body.setVelocityX(-VELOCITY)
                this.body.setDragX(DRAG)
                break;
            case "right":
                this.flipX = false;
                this.body.setVelocityX(VELOCITY)
                this.body.setDragX(DRAG)
                break;
            default: break
        }

    }

}
