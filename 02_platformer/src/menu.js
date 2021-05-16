import { EVENTS, SCENES } from './constants';

export default class Menu extends Phaser.Scene {
    constructor(config) {
        super("Menu");
    }

    init () {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
    }

    preload () {
    }

    create () {
        const logo = this.add.image(this.width/2, 70, 'logo');
        const playText = this.add.text(
            50,
            this.height/2,
            'JUGAR',
            {fontSize:'32px', color:'#FFFFFF'}).setInteractive();
        this.changeScene(playText, SCENES.SCENE1);

        const jugarTxt = this.add.bitmapText(50, this.height/2, 'pixelFont', "PRESS TO START", 65);

    }


    changeScene(playText, scene) {
        playText.on('pointerdown', () => {
            this.scene.start(scene);
            this.scene.start(SCENES.HUD);
            this.scene.bringToTop(SCENES.HUD);
        });
    }
}
