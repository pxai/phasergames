

class Player {
    constructor (name, health = 10) {
        this.name = name;
        this.vote = "";
    }

    reset () {
        this.vote = "";
    }
}

export default Player;
