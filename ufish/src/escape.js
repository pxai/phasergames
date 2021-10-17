import PlayerEscape from "./player_escape";
import Fish from "./objects/fish";
import Coin from "./objects/coin";
import Submarine from "./objects/submarine";
import Underwater from "./underwater";


export default class Escape extends Underwater {
    constructor () {
        super("escape", "escape", PlayerEscape, "outro");
    }

    preload () {
      this.registry.set("hull", 10);
      console.log("escape")
    }
}
