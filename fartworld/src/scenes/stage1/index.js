import Game from "../../game";
import config from "./config";

export default class Stage1 extends Game {
    constructor () {
        super({ key: "stage1" });
    }

    preload () {
        console.log("stage1");
    }

    create () {
        super.create();

        // this.platforms.create(400, 568, 'ground').refreshBody();
        this.platforms = this.physics.add.staticGroup();

        this.platformsLayer.add(this.platforms.create(400, 500, "ground"));
        this.platformsLayer.add(this.platforms.create(50, 250, "ground"));
        this.platformsLayer.add(this.platforms.create(750, 220, "ground"));

        this.playerCollider = this.physics.add.collider(this.player, this.platforms);

        this.beanGenerator.generate(config.beans, config.redBeans);
        this.foeGenerator.generate(config.foes);
    }

    setPlayerCollider (player) {
        this.playerCollider.active = true;
    }

    removePlayerCollider () {
        this.playerCollider.active = false;
    }

    update () {
        super.update();
    }
}
