export default class Ufo extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "ufo");
        this.scene = scene;
        this.setScale(1.5)
        this.setInteractive();
        scene.add.existing(this);
        scene.physics.add.existing(this);
  
        this.body.immovable = true;
        this.body.moves = false;
        this.selected = false;
        this.init();
    }

    init (){
        const ufoAnimation = this.scene.anims.create({
            key: "ufo",
            frames: this.scene.anims.generateFrameNumbers("ufo", { start: 0, end: 7 }, ),
            frameRate: 8,
        });
        this.play({ key: "ufo", repeat: -1 });

        this.on('pointerdown', (pointer) => {
            console.log("Down!! ", pointer);
            if (this.selected) {
                this.selected = false;
                this.clearTint();
            } else {
                this.setTint(0xff0000);
                this.selected = true;
            }
        });

        this.on('pointerout', (pointer) => {
            console.log("OUT!! ", pointer);
           // this.clearTint();
    
        });
    
        this.on('pointerup', (pointer) => {
            console.log("UP!! ", pointer);
    
        });
    }
    

    disable () {
        this.visible = false;
        this.destroy();
    } 
  
    destroy() {
        super.destroy();
    }
}