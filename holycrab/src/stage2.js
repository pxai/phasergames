import Stage1 from "./stage1";

export default class Stage2 extends Stage1 {
    constructor (key = "stage2", next = "game_over") {
        super(key);
        this.next = next;
        this.playerLimited = false;
        this.initial = { x: 300, y: 10080 };
        this.seaInitial = { x: 300, y: 10080 };
        this.cameraSize = { w: 800, h: 10080 * 2 };
        this.worldBounds = true;
        this.startBlock = { x: 300, y: 10080 + 300 };
        this.finishBlock = { x: 300, y: 4000 };
        this.finishSize = 7;
        this.arrowAngle = -90;
        this.music = "music1";
    }

    setFinishBlock() {
        super.setFinishBlock();
        this.add.image(this.finishBlock.x + 40, this.finishBlock.y - 32, "crab2").setOrigin(0.5)
    }
}
