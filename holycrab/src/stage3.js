import Phaser from "phaser";
import Crab from "./crab";
import Block from "./block";
import Shell from "./shell";
import Sky from "./sky";
import FoeGenerator from "./foe_generator";
import Water from "./water";
import Stage1 from "./stage1";

export default class Stage3 extends Stage1 {
    constructor (key = "stage3", next = "game_over") {
        super(key);
        this.next = next;
        this.playerLimited = false;
        this.initial = { x: 300, y: 8000 };
        this.cameraSize = { w: 800, h: 10080 * 2 };
        this.worldBounds = true;
        this.startBlock = { x: 300, y: 8000 + 300 };
        this.finishBlock = { x: 300, y: (10080 * 2) - 500 };
    }

    setCrabs () {
        super.setCrabs();

        this.crab2 = new Crab(this, this.initial.x + 90,  this.initial.y + 20, "crab", this.playerLimited);
        this.crabs.add(this.crab2);
    }

}
