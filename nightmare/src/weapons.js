class Weapon {
    constructor (name, ammo, needed, damage, range = 0) {
        this.name = name;
        this.ammo = ammo;
        this.needed = needed;
        this.damage = damage;
        this.range = range;
        this.acc = 0;
    }

    shoot(range) {
        if (this.ammo > 0) {
            --this.ammo;

            return this.damage - (range - this.range);
        }

        return 0;
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
        return range === 0 ? this.damage : 0;
    }
}

export class Chainsaw extends Weapon {
    constructor (name="chainsaw", ammo = 0, needed = 0, damage = 10) {
        super(name, ammo, needed, damage);
    }
}

export class Gun extends Weapon {
    constructor (name="gun", ammo = 20, needed = 1, damage = 2) {
        super(name, ammo, needed, damage);
    }
}

export class Shotgun extends Weapon {
    constructor (name="shotgun", ammo = 10, needed = 2, damage = 10) {
        super(name, ammo, needed, damage);
    }
}

export class Minigun extends Weapon {
    constructor (name="minigun", ammo = 30, needed = 1, damage = 1, range = 10) {
        super(name, ammo, needed, damage);
    }
}

export class Plasma extends Weapon {
    constructor (name="plasma", ammo = 30, needed = 2, damage = 2, range = 10) {
        super(name, ammo, needed, damage);
    }
}

export class RocketLauncher extends Weapon {
    constructor (name="rocketlauncher", ammo = 5, needed = 4, damage = 20, range = 10) {
        super(name, ammo, needed, damage);
    }
}