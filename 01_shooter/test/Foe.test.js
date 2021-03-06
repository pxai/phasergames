import Foe from "../src/Foe";
import Game from "../src/Game";

describe("Foe class", () => {
    it("should exist", () => {
        expect(Foe).to.not.equal(undefined);
    });

    it("should have constructor", () => {
        const config = {
            width: 800,
            height: 600,
            canvas: document.getElementById("game"),
            type: Phaser.CANVAS,
            backgroundColor: 0x000000,
            scene: [Game],
            physics: {
                default: "arcade",
                arcade: {
                    debug: false
                }
            }
        };
        new Phaser.Game(config);

        new Foe(new Game(), 0, 0);
        // expect(foe).not.to.equal(null);
    });
});
