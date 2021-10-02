import Player from "./player";

class WeezardSpawn {
    constructor (scene) {
        this.scene = scene;
        this.weezards = this.scene.add.group({
            allowGravity: true,
            // mass: 0,
            immovable: false
        })
        this.createPlayerCollider();
         this.scene.physics.world.enable([ this.weezards ]);
        this.scene.physics.add.collider(this.weezards, this.scene.platform);
    }

    createPlayerCollider () {
        this.playerCollider = this.scene.physics.add.overlap(this.scene.player, this.weezards, this.touch, null, this)
    }

    generate () {
        Array(10).fill(0).forEach((w, i) => {
            this.weezards.add(new Player(this.scene, 20, 30, (i + 1)));
        })
    }

    touch (player, clone) {
        console.log("Touch; ", player.number, clone.number);
    }   

    update () {
       this.weezards.children.entries.forEach( weezard => weezard.update() )
    }

    freeze () {
        this.weezards.children.entries.forEach( weezard => weezard.freeze() )
    }

    unfreeze () {
        this.weezards.children.entries.forEach( weezard => weezard.unfreeze() )
    }

    startFloat () {
        this.weezards.children.entries.forEach( weezard => weezard.fly() )
    }

    stopFloat () {
        this.weezards.children.entries.forEach( weezard => weezard.backToLand() )
    }

    batSwarm () {
        this.weezards.children.entries.forEach( weezard => weezard.startEscape() )
    }

    stopEscape () {
        this.weezards.children.entries.forEach( weezard => weezard.stopEscape() )
    }
}

export default WeezardSpawn;