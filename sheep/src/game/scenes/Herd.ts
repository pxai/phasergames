import { Scene, Math } from 'phaser';
import Sheep from './Sheep';

export default class Herd {
  public ship: any;
  constructor (private scene: Scene) {
    this.scene = scene;
    this.ship = this.scene.add.group();
  }

  generate (total: number) {
    for (let i = 0; i < total; i++) {
      this.ship.add(new Sheep(this.scene, Math.Between(100,400), Math.Between(100,400)))
    }
  }

  public spawn (x: number, y: number) {
    this.ship.add(new Sheep(this.scene, x, y))
  }

  get totalShip (): number {
    return this.ship.getLength();
  }
}