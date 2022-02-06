export default class Ice extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "ice0") {
        super(scene, x, y , name);
        this.setPositions(name)
        this.scene = scene;
        this.name = name;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setSize(64, 16, true)
        this.body.immovable = true;
        this.body.moves = false;
        this.occupied = false;
        this.used = false;
        this.init();
    }

    setPositions(name) {
        const {x, y, tweenX, tweenY, speed} = {
            "ice0": {x: this.x, y: -80, tweenX: 0, tweenY: -20, speed: 1000},
            "ice1": {x: this.x, y: -80, tweenX: 0, tweenY: -20, speed: 1000},
            "ice2": {x: this.x, y: +80, tweenX: 0, tweenY: -20, speed: 1000},
            "ice3": {x: this.x, y: 0, tweenX: -100, tweenY: 0, speed: 2000},
            "ice4": {x: this.x, y: 0, tweenX: 0, tweenY: -100, speed: 1000},
            "ice5": {x: this.x, y: -80, tweenX: 0, tweenY: 0, speed: 1000},
        }[name];

        this.x += x;
        this.y += y;
        this.tweenX = tweenX;
        this.tweenY = tweenY;
        this.tspeed = speed;
    }

    init () {
       /* this.scene.tweens.add({
            targets: this,
            duration: this.tspeed,
            y: this.y + this.tweenY,
            x: this.x + this.tweenX,
            repeat: -1,
            yoyo: true
        }) */ 
    }

    touched () {
        if (!this.used) {
            this.used = true;
            this.scene.iceGenerator.generate();
            console.log("Touched")

            this.scene.tweens.add({
                targets: this,
                duration: 150,
                y: {from: this.y, to: this.y + 10},
                yoyo: true,
    
            });

        }

    }
}
