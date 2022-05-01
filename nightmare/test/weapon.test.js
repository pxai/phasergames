import { Fist, Gun, Shotgun } from "../src/weapons";

describe("Weapon", () => {
    describe("Fist", () => {
        it("should exist", () => {
            expect(Fist).to.not.equal(undefined);
        });

        it("should have constructor", () => {
            const fist = new Fist();
            expect(fist).not.to.equal(null);
        });
    });

    describe("Gun", () => {
        it("should exist", () => {
            expect(Gun).to.not.equal(undefined);
        });

        it("should have constructor", () => {
            const gun = new Gun();
            expect(gun).not.to.equal(null);
        });

        it("should do damage on shoot", () => {
            const gun = new Gun();
            expect(gun.shoot(1)).to.equal(1);
        });

        it("should lost ammo on shoot", () => {
            const gun = new Gun();
            expect(gun.ammo).to.equal(20);
            gun.shoot(2);
            expect(gun.ammo).to.equal(19);
        });
    });

    describe("Shotgun", () => {
        it("should exist", () => {
            expect(Shotgun).to.not.equal(undefined);
        });

        it("should have constructor", () => {
            const shotgun = new Shotgun();
            expect(shotgun).not.to.equal(null);
        });

        it("should do damage on shoot", () => {
            const shotgun = new Shotgun();

            expect(shotgun.shoot(0)).to.equal(10);
            expect(shotgun.shoot(1)).to.equal(9);
        });

        it("should lost ammo on shoot", () => {
            const shotgun = new Shotgun();
            expect(shotgun.ammo).to.equal(10);
            shotgun.shoot(2);
            expect(shotgun.ammo).to.equal(9);
        });
    });
});
