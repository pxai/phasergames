import { Scene, Math, Physics } from 'phaser';




export default class Sheep extends Physics.Arcade.Sprite {
    public touched: boolean;

    constructor(scene: Scene, x: number, y: number) {

        super(scene, x, y, "sheep");
        scene.add.existing(this);

        //(scene as any).physics.add.existing(this);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        (this.body as Physics.Arcade.Body).setAllowGravity(false);
        this.body!.setCircle(24);
        this.body!.setOffset(6, 12);
        console.log('Added sheep!!');
    }


    update () {

    }

    setTouched () {
        this.touched = true;
        this.setTint(0x72751b);
    }

    walk (direction: string) {

        if (this.touched) {
            this.body?.stop();
            return;
        }
        const VELOCITY = Math.Between(20, 35);
        const DRAG = 15;
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
