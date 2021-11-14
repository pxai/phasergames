import Stage1 from "./stage1";

export default class Stage2 extends Stage1 {
    constructor (key = "stage2", next = "stage3") {
        super(key);
        this.next = next;
        this.playerLimited = false;
        this.initial = { x: 300, y: 10080 };
        this.seaInitial = { x: 300, y: 10080 };
        this.cameraSize = { w: 800, h: 10080 * 2 };
        this.worldBounds = true;
        this.startBlock = { x: 300, y: 10080 + 300 };
        this.finishBlock = { x: 300, y: 8000 };
    }


}
