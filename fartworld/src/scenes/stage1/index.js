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
        this.createPlatforms(config.platforms)

        this.playerCollider = this.physics.add.collider(this.player, this.platforms);

        this.beanGenerator.generate(config.beans, config.redBeans);
        this.foeGenerator.generate(config.foes, config.platforms);
        this.createDoor(config.door.x, config.door.y)
        this.nextScene = config.nextScene;
        // this.addAlbat();
     }

    update () {
        super.update();
    }

    touch (a,b) {
        console.log("touched",a,b);
    }
}
