import { EVENTS, SCENES } from './constants';

export default class Hud extends Phaser.Scene {
    // private pointsTxt : Phaser.GameObjects.Text;

    constructor(){
        super('Hud');
    }

    create() {
        const scene1 = this.scene.get(SCENES.SCENE1);
        scene1.events.on(EVENTS.UPDATE_POINTS, this.#updatePoints, this);

        this.pointsTxt = this.add.text(20,20, '0', {fontSize:'32px', color:'#FFFFFF'});
    }

    #updatePoints() {
        this.pointsTxt.text = Phaser.Utils.String.Pad(this.registry.get('points'), 5, '0', 1);
    }

}
