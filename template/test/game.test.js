import Game from "../src/game/game";

describe("Game class", () => {
    it("should exist", () => {
        expect(Game).exist;
    });

    it("should have constructor", () => {
        const game = new Game();
    });
});
