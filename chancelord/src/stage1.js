import Stage0 from "./stage0";

export default class Stage1 extends Stage0 {
    constructor () {
        super("stage1");
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }
}
