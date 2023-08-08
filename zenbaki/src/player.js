class Player {
    constructor (scene, name) {
        this.scene = scene;
        this.name = name;
        this.score = 0;
        this.partialScore = 0;
        this.lastMessage = null;
        this.dead = false;
    }

    update () {

    }

    hasSpammed () {
        if (!this.lastMessage) return false;

        const current = new Date();
        const timeDifferenceInMilliseconds = current - this.lastMessage;
        return (timeDifferenceInMilliseconds / 1000) < this.scene.spamTimeWait;
    }


    die () {
        this.dead = true;
        this.scene.checkGameOver();
    }
}

export default Player;
