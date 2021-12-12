import Stage0 from "./stage0";

export default class Stage2 extends Stage0 {
    constructor () {
        super("stage2");
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }
}
