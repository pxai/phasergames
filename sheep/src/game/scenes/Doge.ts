import { Scene, GameObjects, Physics } from 'phaser';


export default class Doge extends Physics.Arcade.Sprite {
    private barking: boolean;
    private locked: boolean = false;

    constructor(scene: Scene, x: number, y: number) {

        super(scene, x, y, "doge");
        this.scene = scene;
        scene.add.existing(this);

        //(scene as any).physics.add.existing(this);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.barking = false;
        (this.body as Physics.Arcade.Body).setAllowGravity(false);
        this.body!.setCircle(24);
        this.body!.setOffset(6, 12);
        console.log('Added doge!!');
        this.setMouse();
        this.scene.events.on('update', this.update, this);
        this.on('destroy', this.onDestroy, this);
    }

    setMouse() {
        this.scene.input.mouse?.disableContextMenu();
        this.scene.input.on('pointerdown', (pointer: Input.Pointer) => this.handleMouseDown(pointer), this);
        //this.scene.input.on('pointerup', (pointer) => this.handleMouseUp(pointer), this);
    }

    handleMouseDown() {
        this.activate()
        this.barking = !this.barking;
    }

    handleMouseUp() {
        this.barking = false;
    }

    activate() {
        this.setAlpha(1);
        //this.startTween.stop()
    }

    update() {
        if (!this.scene || !this.scene.cameras) return;
        if (this.barking) { //  && this.scene.canMove()) {
            const point = this.scene.cameras.main.getWorldPoint(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);
            this.x = point.x;
            this.y = point.y;
            //if (Phaser.Math.Between(0, 3) > 2) new Smoke(this.scene, this.x, this.y)
        }
    }

    onDestroy() {
        this.scene?.events.off('update', this.update, this);
    }

    block() {
        // 1. Remove the mouse click event completely
        this.scene.input.off('pointerdown', this.handleMouseDown, this);
        // 2. Stop movement right away by stopping the bark state
        this.barking = false;
    }
}
