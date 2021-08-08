import Foe from "./foe";

export default class FoeGenerator {
    constructor (scene) {
        this.scene = scene;
        this.foes = [];
    }

    generate (foes) {
           const scene = this.scene;
           this.foes = foes.map(foe => new Foe({ scene, ...foe }));

           //this.foes.forEach(foe => {

               // this.scene.physics.world.on('worldbounds', (foe, up, down, left, right) => {
                   // console.log("HIT",foe.right, foe);
                 //  let direction = right ? -1 : 1;
                   //foe.setVelocityX(foe.velocity.x * direction);
               //});
           //});
       }

       update () {
           this.foes.forEach(foe => { foe.update() });
       }

       destroy () {
           this.foes.forEach(foe => foe.destroy());
       }
}
