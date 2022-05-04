class Weapon {
    constructor (name, ammo, needed, damage, range = 0) {
        this.name = name;
        this.ammo = ammo;
        this.needed = needed;
        this.damage = damage;
        this.range = range;
        this.sprite = name;
        this.acc = 0;
    }

    get info () {
        return " Dam: " + this.damage + " - Cost: " + this.needed
    }

    shoot() {
        return this.damage;
    }

    addCard() {
        this.acc++;

        if (this.acc === this.needed) {
            this.ammo++;
            this.acc = 0;
        }
    }
}

export class Fist extends Weapon {
    constructor (name="fist", ammo = 0, needed = 0, damage = 5) {
        super(name, ammo, needed, damage);
    }

    shoot () {
        return this.damage;
    }
}

export class Chainsaw extends Weapon {
    constructor (name="chainsaw", ammo = 0, needed = 0, damage = 10) {
        super(name, ammo, needed, damage);
    }
}

export class Gun extends Weapon {
    constructor (name="gun", ammo = 0, needed = 1, damage = 2) {
        super(name, ammo, needed, damage);
    }
}

export class Shotgun extends Weapon {
    constructor (name="shotgun", ammo = 0, needed = 2, damage = 10) {
        super(name, ammo, needed, damage);
    }
}

export class Minigun extends Weapon {
    constructor (name="minigun", ammo = 0, needed = 1, damage = 4, range = 10) {
        super(name, ammo, needed, damage);
    }
}

export class Plasma extends Weapon {
    constructor (name="plasma", ammo = 0, needed = 2, damage = 2, range = 10) {
        super(name, ammo, needed, damage);
    }
}

export class RocketLauncher extends Weapon {
    constructor (name="rocketlauncher", ammo = 8, needed = 8, damage = 20, range = 10) {
        super(name, ammo, needed, damage);
    }
}

export class BFG extends Weapon {
    constructor (name="bfg", ammo = 10, needed = 10, damage = 40, range = 10) {
        super(name, ammo, needed, damage);
    }
}