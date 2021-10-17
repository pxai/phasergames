import PlayerUnderwater from "./player_underwater";

const VELOCITY = 150;

export default class PlayerDepth extends PlayerUnderwater {
    constructor (scene, x, y, name = "ufowater") {
        super(scene, x, y, name, 0, 0);
    }
}