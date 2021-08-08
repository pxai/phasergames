import Bean from "./bean";
import RedBean from "./red_bean";

export default class BeanGenerator {
    constructor (scene) {
        this.scene = scene;
        this.beans = [];
    }

    generate (beans, redBeans) {
        const scene = this.scene;
        this.beans = beans.map(bean => new Bean({ scene, ...bean }));
        this.redBeans = redBeans.map(redBean => new RedBean({ scene, ...redBean }));
    }

    destroy () {
        this.beans.forEach(bean => bean.destroy());
        this.redBeans.forEach(redBean => redBean.destroy());
    }
}
