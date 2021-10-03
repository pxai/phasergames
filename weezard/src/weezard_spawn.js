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
        this.scene.wizardsLayer.objects.forEach( (object, i) => {
            if (object.name === "w")
            this.weezards.add(new Player(this.scene, object.x, object.y - 64, (i + 1)));
            //this.turnGroup.add(new JumpPoint(this, object.x, object.y))
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