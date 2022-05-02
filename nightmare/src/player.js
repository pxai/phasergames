import { Fist, Gun, Shotgun, Minigun, Chainsaw, RocketLauncher, BFG } from "./weapons";

export default class Player {
    constructor (scene, health, ammo, armor) {
        this.scene = scene;
        this.init();
        this.health = health;
        this.ammo = ammo;
        this.armor = armor;
    }

    init () {
        this.weapons = {
            "fist": new Fist(), 
            "gun": new Gun(), "shotgun": null, "minigun": null, 
            "bfg": null, "rocketlauncher": null, "chainsaw": null
        }
        this.currentWeapon = this.weapons["fist"];

        this.cards = [];
    }

    pickCard () {
        this.currentWeapon.addCard()
    }

    setWeapon (name) {
        if (this.weapons[name] !== null) {
            this.currentWeapon = this.weapons[name];
            return true;
        }

        this.currentWeapon = this.weapons["fist"];
        return false;

    }

    takeDamage(damage) {

        const totalDamage = this.armor - damage;
       // console.log("Player takes damage! Armor: ", this.armor, " Damage: ",  damage, " Total: ", totalDamage)
        this.scene.updateHealth(totalDamage);
        this.scene.updateArmor(totalDamage)
        if (totalDamage < 0) { this.scene.playAudio("pain")}
        if (this.health <= 0) {
            this.scene.gameOver();
        }
    }
    
    pickWeapon (weapon) {
        if (this.weapons[weapon.name] !== null) {
            // then pick ammo
           // console.log("Added ammo: ", weapon.ammo, this.weapons)
            this.weapons[weapon.name].ammo += weapon.ammo;
        } else {
            this.weapons[weapon.name] = weapon;
        }
        this.currentWeapon = this.weapons[weapon.name];
    }

    shoot (range) {
        if (this.currentWeapon.ammo === 0) {
            this.currentWeapon = this.weapons["gun"].ammo > 0 ? this.weapons["gun"] : this.weapons["fist"];
        }
        console.log("Play! ", this.currentWeapon.name)
        this.scene.playAudio(this.currentWeapon.name)
        return this.currentWeapon.shoot(range);
    }
}
