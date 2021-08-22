import Container from "./container";

export default class ContainerGenerator {
    constructor(scene){
        this.scene = scene;
        this.containers = [];
    }

    generate () {
        setInterval(() => this.add(), 4000)
    }

    add () {
        const added = new Container(this.scene);
        this.containers.push(added);
    }

    update () {
       this.containers.forEach( container => {
        //   if (container.free) container.x -= 1;
       })
    }
}