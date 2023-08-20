import Tetronimo from "../src/tetronimo";

describe("Tetronimo class", () => {
    it("should exist", () => {
        expect(Tetronimo).toBeDefined();
    });

    describe("L", () => {
        it("should have sides", () => {
            const tetronimo = new Tetronimo(0, 0, "L")
            expect(tetronimo.positions[0].length).toBe(4);
        });

        it("should have rotate positions", () => {
            const tetronimo = new Tetronimo(0, 0, "L")
            expect(tetronimo.positions.length).toBe(4);
        });

        it("should rotate to the left", () => {
            const tetronimo = new Tetronimo(0, 0, "L")
            expect(tetronimo.current).toEqual( [{x:0, y: 0},{x:0, y: -1},{x:0, y: 1},{x: 1, y: 1}]);

            tetronimo.rotateLeft();

            expect(tetronimo.current).toEqual([{x:0, y: 0},{x:-1, y: 0},{x: 1, y: 0},{x: 1, y: -1}]);
        });
    })
});
