import { Scene, Math, GameObjects } from 'phaser';
import Crystal from './Crystal';

export default class CyrstalGenerator {
  public crystals: GameObjects.Group;
  constructor (private scene: Scene) {
    this.scene = scene;
    this.crystals = this.scene.add.group();
  }

  generate (total: number) {
    for (let i = 0; i < total; i++) {
      this.crystals.add(new Crystal(this.scene, Math.Between(100,400), Math.Between(100,400)))
    }
  }

  public spawn (x: number, y: number) {
    this.crystals.add(new Crystal(this.scene, x, y))
  }

  get totalShip (): number {
    return this.crystals.getLength();
  }
}