import Ghost from "./ghost";

export default class GhostGenerator {
    constructor(scene) {
        this.scene = scene;
        this.ghosts = [];
    }

    generate() {
        const source = Phaser.Math.Between(0, 3);
        let ghost = null;
        switch (source) {
            case 0:
                ghost = new Ghost(this.scene, Phaser.Math.Between(50, 800), 20, "ghost");
                this.scene.foes.add(ghost, true).setVelocity(0, 50);
                break;
            case 1:
                ghost = new Ghost(this.scene, Phaser.Math.Between(50, 800), this.scene.height, "ghost");
                this.scene.foes.add(ghost, true).setVelocity(0, -50);
                break;
            case 2:
                ghost = new Ghost(this.scene, 0, Phaser.Math.Between(50, 600), "ghost");
                this.scene.foes.add(ghost, true).setVelocity(50, 0);
                break;
            case 3:
                ghost = new Ghost(this.scene, this.scene.width, Phaser.Math.Between(50, 600), "ghost");
                this.scene.foes.add(ghost, true).setVelocity(-50, 0);
                break;
            default:
                break;
        }

        this.ghosts.push(ghost);
        this.scene.time.delayedCall(Phaser.Math.Between(3000, 20000), () => this.generate())
    }

    update () {
        this.ghosts.forEach(ghost => {
            if (ghost) ghost.update() 
         });
    }
}