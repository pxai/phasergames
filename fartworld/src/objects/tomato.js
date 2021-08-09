import Foe from './foe';

export default class Tomato extends Foe {
    constructor ({ scene, x, y, name }) {
        super({scene, x, y, name: "tomato"});
    }
}
