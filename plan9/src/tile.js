export default class Tile extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "3") {
        super(scene, x, y, name);
        this.scene = scene;

        this.setInteractive();
        scene.add.existing(this);
        scene.physics.add.existing(this);
  
        this.body.immovable = true;
        this.body.moves = false;
        this.selected = false;
        this.init();
    }

    init (){
        /*const ufoAnimation = this.scene.anims.create({
            key: "ufo",
            frames: this.scene.anims.generateFrameNumbers("ufo", { start: 0, end: 7 }, ),
            frameRate: 8,
        });
        this.play({ key: "ufo", repeat: -1 });*/

        this.on('pointerdown', (pointer) => {
            this.scene.tweens.add({
                targets: this,
                duration: 100,
                alpha: {from: 0, to: 1},
                repeat: 5,
                onComplete: () => {
                    this.select();
                }
            }) 
        });

        this.on('pointerout', (pointer) => {
            console.log("OUT!! ", pointer);
            this.clearTint();
    
        });
    
        this.on('pointerover', (pointer) => {
            this.setTint(0xff0000);
        });
    }

    select () {
        if (!this.selected) this.scene.changeSelection(this);
        this.setTint(0x333333)
        this.selected = true;
    }

    unSelect () {
        this.selected = false;
        this.clearTint();
    }
    

    disable () {
        this.visible = false;
        this.destroy();
    } 
  
    destroy() {
        super.destroy();
    }
}