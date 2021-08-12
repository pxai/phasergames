import Game from "../../game";
import config from "./config";
import Albat from "../../objects/albat";

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
        this.platformLimits = this.physics.add.staticGroup();
        this.platformsLayer.add(this.platformLimits.create(200, 492, "limit"));
        this.platformsLayer.add(this.platforms.create(400, 500, "ground"));
        this.platformsLayer.add(this.platformLimits.create(600, 492, "limit"));

        this.platformsLayer.add(this.platforms.create(50, 250, "ground"));
        this.platformsLayer.add(this.platformLimits.create(250, 242, "limit"));

        this.platformsLayer.add(this.platformLimits.create(550, 212, "limit"));
        this.platformsLayer.add(this.platforms.create(750, 220, "ground"));
        this.platformsLayer.add(this.platformLimits.create(950, 212, "limit"));

        this.playerCollider = this.physics.add.collider(this.player, this.platforms);

        this.beanGenerator.generate(config.beans, config.redBeans);
        this.foeGenerator.generate(config.foes, config.platforms);
        this.createDoor(config.door.x, config.door.y)
        this.nextScene = config.nextScene;
        this.albat = new Albat(this, 450, 300);
     }

    update () {
        super.update();
        if (this.albat) this.albat.update();
    }

    touch (a,b) {
        console.log("touched",a,b);
    }
}
