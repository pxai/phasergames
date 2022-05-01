class Tile {
    constructor (x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
    }

    shoot () {
        console.log("Shoot on ", this.name, this.x, this.y)
    }

    pick () {
        console.log("Pick on ", this.name, this.x, this.y)
    }
}

export class Empty extends Tile {
    constructor (x, y, name = "emtpy") {
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
        this.ammo = ammo;
        this.type = type;
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
        this.ammo = ammo;
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

export class Shield extends Tile {
    constructor (x, y, shield = 10, name = "shield") {
        super(x, y, name)
        this.ammo = ammo;
        this.shield = shield;
    }

    shoot() {
        super.shoot();
        this.shield = 0;
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