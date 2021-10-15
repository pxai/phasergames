import Fish from "./fish";

export default class FishGenerator {
    constructor(scene){
        this.scene = scene;
        this.fishLayer = this.scene.add.layer();
        this.fish = [];
        this.generate()
    }

    generate () {
        this.add()
        this.generationIntervalId = setInterval(() => this.add(), 4000)
    }

    stop () {
        clearInterval(this.generationIntervalId);
        this.fish.forEach(fish => {
            fish.destroy();
        });
    }

    add () {
        const added = new Fish(this.scene);
        this.fish.push(added);
        console.log("Generated FISH: ", added);
    }

    update () {
       this.fish.forEach( fish => {
           if (fish.x < -800) fish.destroy();
       })
       this.fish = this.fish.filter(fish => fish.active);
       
    }
}