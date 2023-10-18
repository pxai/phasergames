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

  /*

  */
    hasSpammed () {
        if (!this.lastMessage) return false;

        const current = new Date();
        const timeDifferenceInMilliseconds = current - this.lastMessage;
        return (timeDifferenceInMilliseconds / 1000) < this.scene.spamTimeWait;
    }

  /*

  */
    setPenalty () {
        this.penalties++;
        this.score = 0;
        this.dead = true;
        this.scene.time.delayedCall(10000 * this.penalties, () => { this.dead = false; }, null, this);
    }

  /*

  */
    die () {
        this.dead = true;
    }
}

export default Player;
