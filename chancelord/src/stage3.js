import Stage0 from "./stage0";

export default class Stage3 extends Stage0 {
    constructor () {
        super("stage3");
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }
}
