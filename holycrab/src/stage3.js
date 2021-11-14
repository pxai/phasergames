import Crab from "./crab";
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
        this.finishSize = 2;
        this.arrowAngle = 90;
        this.music = "music2";
    }

    setCrabs () {
        super.setCrabs();

        this.crab2 = new Crab(this, this.initial.x + 90,  this.initial.y + 20, "crab2", this.playerLimited);
        this.crabs.add(this.crab2);
        this.ending = this.add.rectangle(0, this.finishBlock.y + 200 , 10000, 4, 0x008888).setOrigin(0).setAlpha(0)
        this.physics.world.enable(this.ending);
        this.ending.body.immovable = true;
        this.ending.body.moves = false;
        this.physics.add.collider(this.crabs, this.ending, this.restartScene, () => {
            return true;
        }, this);
    }

}
