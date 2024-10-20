

import NameGenerator from "./name_generator";
class Character extends Phaser.GameObjects.Sprite{
    constructor (scene, x, y, name) {
        super(scene, x, y, name);
        this.scene = scene;
        this.scene.add.existing(this);
        this.name = name;
        this.heroName = new NameGenerator().generateName();
        this.health = 100;
        this.attack = 10;
        this.defense = 5;
        this.level = 1;
        this.coins = 100;
    }

    hit (points) {
        this.health -= points;
        console.log("Character gets hit: -", points)
    }

    isDead () {
        return this.health < 0;
    }

    buy (item) {
        this.coins -= item.value;
        this.applyEffects(item);
    }

    applyEffects (item) {
        this.defense += item.defense;
        this.attack += item.attack;
        this.health += item.health;
    }
}

export default Character;
