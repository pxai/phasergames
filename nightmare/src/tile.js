import { Gun, Shotgun, Minigun, Chainsaw, RocketLauncher, BFG } from "./weapons";
import { Grunt, ShotgunGuy, MinigunGuy, Imp, Demon, Cacodemon, Knight, Mancubus, Cyberdemon } from "./foe";

class Tile {
    constructor (x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.sprite = name;
        this.sound = name;
    }

    shoot () {
        console.log("Shoot on ", this.name, this.x, this.y)
    }

    pick () {
        console.log("Pick on ", this.name, this.x, this.y)
    }
}

export class Empty extends Tile {
    constructor (x, y, name = "empty") {
        super(x, y, name)
    }

    shoot() {
        super.shoot();
    }

    pick() {
        super.pick();
    }
}

export class Ammo {
    constructor (type, amount) {
        this.type = type;
        this.amount = amount;
    }
}

export class AmmoTile extends Tile {
    constructor (x, y, ammo, name = "ammo") {
        super(x, y, name)
        this.ammo = ammo || new Ammo("gun", 5);

    }

    shoot() {
        super.shoot();
        this.ammo = null;
    }

    pick() {
        super.pick();
        return this.ammo;
    }
}

export class WeaponTile extends Tile {
    constructor (x, y, name) {
        super(x, y, name)
        this.createWeapon(name)
        this.sprite = this.name = this.weapon.sprite;
    }

    createWeapon (name) {

        switch (name) {
            case "shotgun": this.weapon = new Shotgun(); break;
            case "minigun": this.weapon = new Minigun(); break;
            case "rocketlauncher": this.weapon = new RocketLauncher(); break;
            case "bfg": this.weapon = new BFG(); break;
            case "chainsaw": this.weapon = new Chainsaw(); break;
            default: this.weapon = new Gun(); break;
        }
    }

    shoot() {
        super.shoot();
        this.ammo = null;
    }

    pick() {
        super.pick();
        return this.ammo;
    }
}

export class FoeTile extends Tile {
    constructor (x, y, name) {
        super(x, y, name)
        this.createFoe(name)
        this.sprite = this.name = this.foe.sprite;
    }

    createFoe (name) {

        switch (name) {
            case "grunt": this.foe = new Grunt(); break;
            case "shotgun_guy": this.foe = new ShotgunGuy(); break;
            case "minigun_guy": this.foe = new MinigunGuy(); break;
            case "imp": this.foe = new Imp(); break;
            case "demon": this.foe = new Demon(); break;
            case "cacodemon": this.foe = new Cacodemon(); break;
            case "knight": this.foe = new Knight(); break;
            case "mancubus": this.foe = new Mancubus(); break;
            case "cyberdemon": this.foe = new Cyberdemon(); break;
            default: this.foe = new Grunt(); break;
        }
    }

    shoot() {
        super.shoot();
        this.ammo = null;
    }

    pick() {
        super.pick();
        return this.ammo;
    }
}

export class Health extends Tile {
    constructor (x, y, health = 10, name = "health") {
        super(x, y, name)
        this.health = health;
    }

    shoot() {
        super.shoot();
        this.health = 0;
    }

    pick() {
        super.pick();
        return this.health;
    }
}

export class Armor extends Tile {
    constructor (x, y, armor = 10, name = "armor") {
        super(x, y, name)
        this.armor = armor;
    }

    shoot() {
        super.shoot();
        this.armor = 0;
    }

    pick() {
        super.pick();
    }
}

export class Barrell extends Tile {
    constructor (x, y, shield = 10, name = "barrell") {
        super(x, y, name)
    }

    shoot() {
        super.shoot();;
    }

    pick() {
        super.pick();
    }
}

export class Exit extends Tile {
    constructor (x, y, name = "exit") {
        super(x, y, name)
    }

    shoot() {
        super.shoot();
    }

    pick() {
        super.pick();
    }
}