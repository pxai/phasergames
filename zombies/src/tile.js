export default class Tile {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.players = [];
        this.chopper = null;
    }

    addPlayer (player) {
        console.log("Adding player: ", player.name, player.side, !this.players.find(p => p.name === player.name))
        if (!this.players.find(p => p.name === player.name)) {
            this.players.push(player);
        }
    }

    addChopper(chopper) {
        this.chopper = chopper;
    }

    removePlayer (player) {
        this.players = this.players.filter(p => p.name !== player.name);
    }

    zombieInside () {
        return  this.players.some(p => p.side === "zombie");
    }

    chopperInside () {
        return this.chopper != null;
    }

    print() {

        const player = this.players.length > 0 ? this.players[0].side.substring(0,1).toUpperCase() : " ";
        return `[${player}]`
    }
}