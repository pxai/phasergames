export default class GameScene extends Phaser.Scene {
    constructor () {
        super({ key: "GameScene"});
    }

    preload () {
        console.log("Preload");
    }

    create () {
        console.log("Create");
    }

    update (time, delta) {
        //console.log("Update", time, delta);
    }
}