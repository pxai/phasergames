class Player {
    constructor (scene, name) {
        this.scene = scene;
        this.name = name;
        this.score = 0;
        this.lastMessage = null;
        this.dead = false;
        this.penalties = 0;
    }

    update () {

    }
}

export default Player;
