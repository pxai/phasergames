import GameScene from "./GameScene.js";

const config = {
    width: 400,
    height: 300,
    parent: "container",
    type: Phaser.CANVAS,
    scene: [GameScene]
};

new Phaser.Game(config);