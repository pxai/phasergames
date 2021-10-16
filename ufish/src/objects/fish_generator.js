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
        this.generationIntervalId = setInterval(() => this.add(), 4000)
    }

    stop () {
        clearInterval(this.generationIntervalId);
        this.fishGroup.children.entries.forEach(fish => {
            fish.destroy();
        });
    }

    add () {
        this.fishGroup.add(new Fish(this.scene));
        console.log("Generated FISH: ");
    }

    update () {
        this.fishGroup.children.entries.forEach( fish => {
           if (fish.x < -800) fish.destroy();
           fish.update();
       })
       this.fish = this.fish.filter(fish => fish.active);
       
    }
}