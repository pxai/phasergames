import Phaser from "phaser";
import Crab from "./crab";
import Block from "./block";
import Shell from "./shell";
import Sky from "./sky";
import FoeGenerator from "./foe_generator";
import Water from "./water";
import Stage1 from "./stage1";

export default class Stage2 extends Stage1 {
    constructor (key = "stage2", next = "stage3") {
        super(key);
        this.next = next;
        this.playerLimited = false;
        this.initial = { x: 0, y: 10080 };
        this.cameraSize = { w: 800, h: 10080 * 2 };
        this.worldBounds = true;
    }


}
