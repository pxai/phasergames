import Bean from "./bean";

export default class FoeGenerator {
    constructor (scene) {
        this.scene = scene;
        this.beans = [];
    }

    generate (foes) {
        const scene = this.scene;
        this.foes = foes.map(foe => new Bean({ scene, ...foe }));
    }
}
