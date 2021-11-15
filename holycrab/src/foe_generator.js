import Seagull from "./seagull";

export default class FoeGenerator {
  constructor(scene){
    this.scene = scene;
    this.foeLayer = this.scene.add.layer();
    this.foe = [];
    this.foeGroup = this.scene.add.group()
}

  generate () {
      this.generationIntervalId = setInterval(() => this.add(), 3000)
  }

  pause () {
    this.stop();
  }

  stop () {
      clearInterval(this.generationIntervalId);
      this.foeGroup.clear(true, true);
  }

  add () {
      this.foeGroup.add(new Seagull(this.scene, this.scene.crab.x + Phaser.Math.Between(500, 600), this.scene.crab.y + Phaser.Math.Between(-200, 200)));
      this.foeGroup.add(new Seagull(this.scene, this.scene.crab.x + Phaser.Math.Between(500, 600), this.scene.crab.y + Phaser.Math.Between(-200, 200)));
      this.foeGroup.add(new Seagull(this.scene, this.scene.crab.x - Phaser.Math.Between(500, 600), this.scene.crab.y + Phaser.Math.Between(-200, 200), 1));
  }

  update () {
      this.foeGroup.children.entries.forEach( foe => {
        if (foe.x < 0) foe.destroy();
        foe.update();
    })
  }
}