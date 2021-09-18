import Ghost from "./ghost";

export default class GhostGenerator {
    constructor(scene) {
        this.scene = scene;
        this.ghosts = [];
    }

    generate() {
        const ghost = new Ghost(this.scene, 200, 20, "ghost");
        this.scene.foes.add(ghost, true).setVelocity(0, 50);
        this.ghosts.push(ghost);
    }

    update () {
        this.ghosts.forEach(ghost => {
            if (ghost) ghost.update() 
         });
    }
}