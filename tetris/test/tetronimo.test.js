import Tetronimo from "../src/tetronimo";

describe("Tetronimo class", () => {
    it("should exist", () => {
        expect(Tetronimo).toBeDefined();
    });

    describe("L", () => {
        let tetronimo, initial;

        beforeEach(() =>{
            tetronimo = new Tetronimo(0, 0, "L");
            initial = tetronimo.current;
        })

        it("should have sides", () => {
            expect(tetronimo.positions[0].length).toBe(4);
        });

        it("should be floating by default", () => {
            expect(tetronimo.floating).toBe(true);
        });

        it("should have rotate positions", () => {
            expect(tetronimo.positions.length).toBe(4);
        });

        it("should have real positions from start", () => {
            expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}, {x: 0, y: -1},{x:0, y: -2},{x: 1, y: 0}]);
        });

        it("should have real positions anywhere", () => {
            const tetronimo = new Tetronimo(4, 5, "L")
            expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}, {x: 4, y: 4},{x:4, y: 3},{x: 5, y: 5}]);
        });

        it("should rotate to the right", () => {
            const tetronimo = new Tetronimo(0, 0, "L")
            expect(tetronimo.current).toEqual(initial);

            tetronimo.rotateRight();

            expect(tetronimo.current).toEqual(tetronimo.positions[1]);
        });

        it("completes rotation to right", () => {
            const tetronimo = new Tetronimo(0, 0, "L")
            expect(tetronimo.current).toEqual(initial);

            [0, 1, 2].forEach(i => {
                tetronimo.rotateRight()
                expect(tetronimo.current).toEqual(tetronimo.positions[i+1]);
            });
            tetronimo.rotateRight();

            expect(tetronimo.current).toEqual(initial);
        });

        it("should rotate to the left", () => {
            const tetronimo = new Tetronimo(0, 0, "L")
            expect(tetronimo.current).toEqual(initial);

            tetronimo.rotateLeft();

            expect(tetronimo.current).toEqual(tetronimo.positions[3]);
        });

        it("completes rotation to left", () => {
            expect(tetronimo.current).toEqual(initial);

            [3, 2, 1].forEach(i => {
                tetronimo.rotateLeft()
                expect(tetronimo.current).toEqual(tetronimo.positions[i]);
            });
            tetronimo.rotateLeft()

            expect(tetronimo.current).toEqual(initial);
        });
    })
});
