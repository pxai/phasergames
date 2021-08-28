import Container from "./container";
import containerTypes from "./container_types";

export default class ContainerGenerator {
    constructor(scene){
        this.scene = scene;
        this.reset();
    }

    generate () {
      if (this.scene.number === 1) this.generateInitial();

      this.generationIntervalId = setInterval(() => this.add(), 2000)
    }

    generateInitial() {
      const [x, y] = [this.scene.player.x + Phaser.Math.Between(200, 400), this.scene.player.y + Phaser.Math.Between(-200, 200)];
      const container = containerTypes[Phaser.Math.Between(1, containerTypes.length - 1)];
      const added = new Container(this.scene, container, x, y);
      const instruction = this.scene.add.bitmapText(x, y + 100, "pixelFont", "Pick containers like this!!", 20).setOrigin(0.5);
      this.scene.tweens.add({
        targets: instruction,
        duration: 2000,
        alpha: {
          from: 1,
          to: 0
        },
      });
      this.containers.push(added);
    }
  
    stop () {
      clearInterval(this.generationIntervalId);
      this.containers.forEach(container => {
        if (container.free) container.destroy();
      });
    }

    add () {
        const [x, y] = this.positions[this.current];
        const container = containerTypes[Phaser.Math.Between(1, containerTypes.length - 1)];
        const added = new Container(this.scene, container);
        this.containers.push(added);
        this.current = this.current === this.positions.length - 1 ? 0 : this.current + 1;
    }

    update () {
       this.containers.forEach(container => {
           if (container.free) container.x -= 1;
       });
    }

    reset () {
        this.current = 0
        this.positions = this.generatePositions(this.scene.width / 3, this.scene.height, this.scene.width);
        if (this.containers) this.containers.forEach(container => { container.destroy() })
        this.containers = [];
      }

    generatePositions (width, height, begin = 0) {
        console.log("There:", width, height);
        const positions = Array(Math.round(width / 16)).fill([])
        positions.forEach((position, i) => { positions[i] = Array(Math.round(height / 32)).fill([0, 0]) })
        positions.forEach((col, i) => {
          positions[i].forEach((row, j) => {
            positions[i][j] = [begin + (i * 17) + 1, (j * 33)]
          })
        })
        this.orderedBlocks = [...positions]
        return positions.flat().sort((a, b) => 0.5 - Math.random())
      }
}