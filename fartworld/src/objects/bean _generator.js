import Bean from './bean';

export default class BeanGenerator {
    constructor (scene) {
        this.scene = scene;
        this.beans = [];
    }

    generate (beans) {
        console.log("Bean to generate: ", beans);
        const scene = this.scene;
        this.beans = beans.map(bean => new Bean({ scene, ...bean }));
        
    }
}