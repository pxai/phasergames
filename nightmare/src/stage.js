import { Empty, AmmoTile, WeaponTile, FoeTile, Health, Armor, Exit } from "./tile";

export default class Stage {
    constructor (name) {
        this.name = name;
        this.init();
    }

    init() {
        this.width = Phaser.Math.Between(2, 6)
        this.height = Phaser.Math.Between(2, 5)
        this.tiles = [];
        this.latest = null;
        for (let x = 0; x < this.width; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.latest = this.tiles[x].push(this.generate(x, y))
                //this.latest = this.tiles[x].push(new Ammo(x, y))
            }
        }
    }

    get length () {
        return this.width * this.height;
    }

    generate(x, y) {
        const points = Phaser.Math.Between(0, 100);
        console.log(points)
        //const foe = Phaser.Math.RND.pick([ "grunt", "shotgun_guy","grunt", "shotgun_guy","grunt", "shotgun_guy", "minigun_guy", "minigun_guy", "imp", "imp", "imp", "demon", "cacodemon", "knight", "mancubus", "cyberdemon"])
        //return new FoeTile(x, y, foe)

        if (points >= 0 && points < 30) {
            return new Empty(x, y)
        } else if (points >= 30 && points < 40) {
            return new AmmoTile(x, y)
        } else if (points >= 40 && points < 50) {
            return new Health(x, y)
        } else if (points >= 50 && points < 60) {
            return new Armor(x, y)
        } else if (points >= 60 && points < 85) {
            const foe = Phaser.Math.RND.pick([ "grunt", "shotgun_guy","grunt", "shotgun_guy","grunt", "shotgun_guy", "minigun_guy", "minigun_guy", "imp", "imp", "imp", "demon", "cacodemon", "knight", "mancubus", "cyberdemon"])
            return new FoeTile(x, y, foe)
        }  else if (points >= 85 && points < 98) {
            const weapon = Phaser.Math.RND.pick(["shotgun", "shotgun", "minigun", "minigun","shotgun", "shotgun", "minigun", "minigun","rocketlauncher","bfg", "chainsaw"])
            return new WeaponTile(x, y, weapon)
        } else if (points >= 98 && points <= 100) {
            return new Exit(x, y)
        } else {
            return new Empty(x, y)
        }
    }
}