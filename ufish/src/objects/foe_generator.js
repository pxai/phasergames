import Chopper from "./chopper";

export default class FoeGenerator {
  constructor(scene){
    this.scene = scene;
    this.foeLayer = this.scene.add.layer();
    this.foe = [];
    this.foeGroup = this.scene.add.group()
    this.generate()
}

  generate () {
      this.add()
      this.generationIntervalId = setInterval(() => this.add(), 4000)
  }

  stop () {
      clearInterval(this.generationIntervalId);
      this.foeGroup.children.entries.forEach(foe => {
          foe.destroy();
      });
  }

  add () {
      this.foeGroup.add(new Chopper(this.scene));
  }

  update () {
      this.foeGroup.children.entries.forEach( foe => {
        if (foe.x < -800) foe.destroy();
        foe.update();
    })
  }
}