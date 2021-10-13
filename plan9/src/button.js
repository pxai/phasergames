export default class Button extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name, scale = 2) {
        super(scene, x, y, name);
        this.name = name;
        this.setInteractive()
        this.setScale(scale)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setTexture(name, 0)
        this.body.immovable = true;
        this.body.moves = false;
        this.init();
    }

    init () {
        this.on('pointerdown', (pointer) => {
            console.log("DOWN ", pointer);
            this.setTexture(this.name, 2)
        });

        this.on('pointerout', (pointer) => {
            console.log("OUT!! ", pointer);
            this.setTexture(this.name, 0)
        });
    
        this.on('pointerover', (pointer) => {
            console.log("OVER MEEEE! ", pointer);
            this.setTexture(this.name, 1)
        });
    }
}