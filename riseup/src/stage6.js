import Stage0 from "./stage0";

export default class Stage6 extends Stage0 {
    constructor () {
        super("stage6");
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    finishScene (next) {
        this.theme.stop();
        this.scene.start("outro", {next: next, name: "STAGE", number: this.number + 1, time: this.time * 2});
    }
}
