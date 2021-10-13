export default class Button extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, name);

        this.setInteractive()
        this.setScale(0.7)
        scene.add.existing(this);
        scene.physics.add.existing(this);
  
        this.body.immovable = true;
        this.body.moves = false;
        this.init();
    }

    init () {
        this.on('pointerdown', (pointer) => {
            console.log("DOWN ", pointer);
            this.setTint(0xffffff)
        });

        this.on('pointerout', (pointer) => {
            console.log("OUT!! ", pointer);
            this.clearTint();
    
        });
    
        this.on('pointerover', (pointer) => {
            console.log("OVER MEEEE! ", pointer);
            this.setTint(0xffffff);
        });
    }
}