import Board from "../src/board";
import Tetronimo from "../src/tetronimo";

describe("Board class", () => {
    it("should exist", () => {
        expect(Board).toBeDefined();
    });

    it("constructor builds board", () => {
        const board = new Board();

        expect(board.board.length).toBe(board.height);
        expect(board.board[0].length).toBe(board.width);
    });

    it("add tetronimo to board", () => {
        const board = new Board();
        const tetronimo = new Tetronimo(0, 0, "L");

        board.add(tetronimo);
        expect(board.board[0][0]).toBe(tetronimo);
    });

    it("return board tetronimos", () => {
        const board = new Board();
        const tetronimo1 = new Tetronimo(0, 0, "L");
        const tetronimo2 = new Tetronimo(4, 4, "L");
        const tetronimo3 = new Tetronimo(2, 2, "L");

        board.add(tetronimo1);
        expect(board.tetronimos).toEqual([tetronimo1]);
        tetronimo1.floating = false;
        board.add(tetronimo2);
        expect(board.tetronimos).toEqual([tetronimo1, tetronimo2]);

        tetronimo2.floating = false;
        board.add(tetronimo3);
        expect(board.tetronimos).toEqual([tetronimo1, tetronimo3, tetronimo2]);
    });

    it("return absoluteTetronimos", () => {
        const board = new Board();
        const tetronimo1 = new Tetronimo(0, 0, "L");
        const tetronimo2 = new Tetronimo(4, 4, "L");
        const tetronimo3 = new Tetronimo(2, 2, "L");

        board.add(tetronimo1);

        expect(board.absoluteTetronimos).toEqual([{x: tetronimo1.x, y: tetronimo1.y}, {x: 0, y: -1},{x:0, y: -2},{x: 1, y: 0}]);
    });

    it("return absoluteTetronimos", () => {
        const board = new Board();
        const tetronimo1 = new Tetronimo(0, 19, "L");
        const tetronimo2 = new Tetronimo(4, 4, "L");
        const tetronimo3 = new Tetronimo(2, 2, "L");

        board.add(tetronimo1);
        expect(board.absoluteFixedTetronimos).toEqual([]);
        board.move();

        expect(board.absoluteFixedTetronimos.map(tetronimo => tetronimo.absolute).flat()).toEqual([{x: tetronimo1.x, y: tetronimo1.y}, {x: 0, y: 18},{x:0, y: 17},{x: 1, y: 19}]);
    });

    it("moves down floating elements", () => {
        const board = new Board();
        const tetronimo = new Tetronimo(0, 0, "L");

        board.add(tetronimo);

        expect(board.board[0][0]).toBe(tetronimo);
        expect(board.board[0][0].y).toBe(0);
        expect(board.board[0][0].floating).toBe(true);

        Array(board.height-1).fill(0).forEach((_,i) => {
            expect(board.board[i][0]).toBe(tetronimo);
            expect(board.board[i][0].y).toBe(i);
            expect(board.board[i][0].floating).toBe(true);

            if (i>0) {
                expect(board.board[i-1][0]).toBe(false);
            }
            board.move();
        })

        expect(board.board[board.height - 1][0]).toBe(tetronimo);
        expect(board.board[board.height - 1][0].y).toBe(board.height - 1);
        expect(board.board[board.height - 1][0].floating).toBe(false);
    });

    it("changes state of tetronimo to touchdown when hitting bottom", () => {
        const board = new Board();
        const tetronimo = new Tetronimo(0, 18, "L");

        board.add(tetronimo);

        expect(board.board[18][0]).toBe(tetronimo);
        expect(board.board[18][0].y).toBe(18);
        expect(board.board[18][0].floating).toBe(true);

        board.move();

        expect(board.board[19][0]).toBe(tetronimo);
        expect(board.board[19][0].y).toBe(19);
        expect(board.board[19][0].floating).toBe(false);
    });

    describe("#touchdown", () => {
        it("return false if one tetronimo is not blocked", () => {
            const board = new Board();
            const tetronimo = new Tetronimo(0, 19, "L");
            board.add(tetronimo);

            expect(board.touchdown).toBe(false)
        });

        it("return true if all tetronimo are blocked", () => {
            const board = new Board();
            const tetronimo = new Tetronimo(0, 19, "L");
            board.add(tetronimo);

            board.move()

            expect(board.touchdown).toBe(true)
        });
    });

    describe("#collidesToBottom", () => {
        it("should return false if a tetronimo does not collide", () => {
            const board = new Board();
            const tetronimo = new Tetronimo(0, 19, "L");
            board.add(tetronimo);
            const notColliding = new Tetronimo(0, 0, "L");
            board.add(notColliding);

            expect(board.collidesToBottom(notColliding)).toBe(false);
        })

        it("should return true if a tetronimo does collide", () => {
            const board = new Board();
            const tetronimo = new Tetronimo(0, 19, "L");
            board.add(tetronimo);
            const colliding = new Tetronimo(0, 16, "L");
            board.add(colliding);

            expect(board.collidesToBottom(colliding)).toBe(true);
        })
    })

    describe("#collidesToRight", () => {
        it("should return false if a tetronimo does not collide", () => {
            const board = new Board();
            const tetronimo = new Tetronimo(0, 19, "L");
            board.add(tetronimo);
            const notColliding = new Tetronimo(0, 0, "L");
            board.add(notColliding);

            expect(board.collidesToRight(notColliding)).toBe(false);
        });

        it("should return true if a tetronimo does collide", () => {
            const board = new Board();
            const tetronimo = new Tetronimo(2, 19, "L");
            board.add(tetronimo);
            const colliding = new Tetronimo(0, 19, "L");
            board.add(colliding);

            expect(board.collidesToRight(colliding)).toBe(true);
        });
    });

    describe("#collidesToLeft", () => {
        it("should return false if a tetronimo does not collide", () => {
            const board = new Board();
            const tetronimo = new Tetronimo(0, 19, "L");
            board.add(tetronimo);
            const notColliding = new Tetronimo(0, 0, "L");
            board.add(notColliding);

            expect(board.collidesToLeft(notColliding)).toBe(false);
        });

        it("should return true if a tetronimo does collide", () => {
            const board = new Board();
            const tetronimo = new Tetronimo(0, 19, "L");
            board.add(tetronimo);
            const colliding = new Tetronimo(2, 19, "L");
            board.add(colliding);

            expect(board.collidesToLeft(colliding)).toBe(true);
        });
    });


    describe("#completed", () => {
        it("should return empty array if lines are not completed", () => {
            const board = new Board();
            const tetronimo = new Tetronimo(0, 19, "L");

            expect(board.completed().flat()).toEqual([]);
        })

        it("should return array with completed lines completed", () => {
            const board = new Board();
            const tetronimos = Array(5).fill(0).map((_,i) => new Tetronimo(i*2, 19, "L"));
            tetronimos.forEach(tetronimo => { board.add(tetronimo); board.move()})

            expect(board.completed()[0].flat()).toEqual([
                { x: 0, y: 19 },{ x: 1, y: 19 }, { x: 2, y: 19 }, { x: 3, y: 19 },{ x: 4, y: 19 },
                { x: 5, y: 19 },{ x: 6, y: 19 }, { x: 7, y: 19 }, { x: 8, y: 19 }, { x: 9, y: 19 }
              ]);
        });
    });

    describe("#tetronimoIn", () => {
        it("should return null array if there's nothing in that position", () => {
            const board = new Board();
            const tetronimo = new Tetronimo(0, 19, "L");
            board.add(tetronimo)

            expect(board.tetronimoIn({x: 0, y: 0})).toEqual(undefined);
        })

        it("should return the tetronimo in that position", () => {
            const board = new Board();
            const tetronimo = new Tetronimo(0, 19, "L");
            board.add(tetronimo)

            expect(board.tetronimoIn({x: 0, y: 19})).toEqual(tetronimo);
        });
    });
});
