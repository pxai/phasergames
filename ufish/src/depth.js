import PlayerDepth from "./player_depth";
import Fish from "./objects/fish";
import Coin from "./objects/coin";
import Submarine from "./objects/submarine";
import Underwater from "./underwater";


export default class Depth extends Underwater {
    constructor () {
        super("depth", "depth", PlayerDepth, "escape");
    }

    preload () {
      this.registry.set("hull", 10);
    }
}
