export default class Ice extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, layer) {
        super(scene, x, y , 60, 10, 0xff000000);
        this.scene = scene;
        this.name = "ice0";
        this.ground = this.scene.add.sprite(x, y, "ice0");
        this.scene.iceBlock.add(this.ground)
        this.setPositions(this.name)
        this.setAlpha(0);

        layer.add(this);
        layer.add(this.ground);
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this.ground);
        this.scene.physics.add.existing(this.ground);

        this.body.setSize(55, 5)
        this.ground.body.setSize(64, 16, true)
        this.body.immovable = true;
        this.body.moves = false;
        this.ground.body.immovable = true;
        this.ground.body.moves = false;
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
        this.y += y - 12;
        this.ground.x += x;
        this.ground.y += y;
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

            this.scene.tweens.add({
                targets: this.ground,
                duration: 150,
                y: {from: this.ground.y, to: this.ground.y + 10},
                yoyo: true,
    
            });

        }

    }
}
