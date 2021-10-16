import Fish from "./fish";

export default class FishGenerator {
    constructor(scene){
        this.scene = scene;
        this.fishLayer = this.scene.add.layer();
        this.fish = [];
        this.fishGroup = this.scene.add.group()
        this.generate()
    }

    generate () {
        this.add()
        this.generationIntervalId = setInterval(() => this.add(), 2000)
    }

    stop () {
        clearInterval(this.generationIntervalId);
        this.fishGroup.children.entries.forEach(fish => {
            fish.destroy();
        });
    }

    add () {
        this.fishGroup.add(new Fish(this.scene));
    }

    update () {
        this.fishGroup.children.entries.forEach( fish => {
           if (fish.x < - 32 || fish.x > this.scene.width + 32) {
               fish.destroy();
               this.fishGroup.remove(fish);
           }
           fish.update();
       })
    }
}