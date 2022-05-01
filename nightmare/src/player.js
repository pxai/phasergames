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
        const weapons = this.scene.registry.get("weapons");

        if (weapons === null) {
            this.weapons = {
                "fist": new Fist(), 
                "gun": new Gun(), "shotgun": null, "minigun": null, 
                "bfg": null, "rocketlauncher": null, "chainsaw": null
            }
            this.scene.updateWeapons(this.weapons);
        } else {
            this.weapons = this.scene.registry.get("weapons");
        }

        this.currentWeapon = this.weapons["gun"];

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
        this.scene.updateHealth(totalDamage);
        const armorDamage = this.armor >= damage ? damage : this.armor;
        // console.log("Player takes damage! Armor: ", this.armor, " Damage: ",  damage, " Total: ", totalDamage, ", armorDamage: ", armorDamage)

        this.scene.updateArmor(-armorDamage)
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
            this.scene.updateWeapons(this.weapons);
        }
        this.currentWeapon = this.weapons[weapon.name];
    }

    shoot (range) {
        if (this.ammo < this.currentWeapon.needed) {
            this.currentWeapon = this.ammo === 0 ? this.weapons["fist"] : this.weapons["gun"];
        } 

        this.scene.playAudio(this.currentWeapon.name)
        this.scene.updateAmmo(-this.currentWeapon.needed);
        return this.currentWeapon.shoot(range);
    }
}
