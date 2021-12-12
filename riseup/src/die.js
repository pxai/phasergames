import Dust from "./dust";
import Shot from "./shot";

export default class Die extends Phaser.GameObjects.Sprite {
    constructor(scene, player, name = "d3") {
        super(scene, player.x, player.y , name);
        this.player = player;
        this.setPositions(name)
    
        this.scene = scene;
        this.name = name;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.body.immovable = true;
        this.body.moves = false;
        this.shooting = false;
        this.init();
    }

    setPositions(name) {
        const offset = this.player.right ? 150 : -150;// this.x + offset, this.y - 80
        const {x, y, tweenX, tweenY, speed} = {
            "d1": {x: offset, y: -80, tweenX: 0, tweenY: -20, speed: 1000},
            "d2": {x: offset, y: -80, tweenX: 0, tweenY: -20, speed: 1000},
            "d3": {x: offset, y: +80, tweenX: 0, tweenY: -20, speed: 1000},
            "d4": {x: offset, y: 0, tweenX: -100, tweenY: 0, speed: 2000},
            "d5": {x: offset, y: 0, tweenX: 0, tweenY: -100, speed: 1000},
            "d6": {x: offset, y: -80, tweenX: 0, tweenY: 0, speed: 1000},
        }[name];

        this.x += x;
        this.y += y;
        this.tweenX = tweenX;
        this.tweenY = tweenY;
        this.tspeed = speed;
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: this.tspeed,
            y: this.y + this.tweenY,
            x: this.x + this.tweenX,
            repeat: -1,
            yoyo: true
        })  
    }

    touched () {
        
    }

    delayedDestroy(scene, die) {
        scene.time.delayedCall(200, () => {
            new Dust(scene, die.x, die.y)
            this.shot(scene)
            this.destroy()
        }, null, this);
    }

    shot (scene) {
        if (this.shooting) return;
        this.shooting = true;
        scene.shots.add(new Shot(scene, this.x, this.y, 300, 0))
        scene.shots.add(new Shot(scene, this.x, this.y, -300, 0))
        scene.shots.add(new Shot(scene, this.x, this.y, 0, 300))
        scene.shots.add(new Shot(scene, this.x, this.y, 0, -300))
        scene.shots.add(new Shot(scene, this.x, this.y, 300, 300))
        scene.shots.add(new Shot(scene, this.x, this.y, -300, -300))
        scene.shots.add(new Shot(scene, this.x, this.y, -300, 300))
        scene.shots.add(new Shot(scene, this.x, this.y, 300, -300))
    }

    destroy() {
        super.destroy();
    }
}
