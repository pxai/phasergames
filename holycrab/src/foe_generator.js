import Seagull from "./seagull";

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
      this.generationIntervalId = setInterval(() => this.add(), 2000)
  }

  stop () {
      clearInterval(this.generationIntervalId);
      this.foeGroup.children.entries.forEach(foe => {
          foe.destroy();
      });
  }

  add () {
      this.foeGroup.add(new Seagull(this.scene, this.scene.crab.x + 500, this.scene.crab.y + Phaser.Math.Between(-200, 200)));
  }

  update () {
      this.foeGroup.children.entries.forEach( foe => {
        if (foe.x < 0) foe.destroy();
        foe.update();
    })
  }
}