import Board from "../src/board";
import Tetronimo from "../src/tetronimo";

describe("Board class", () => {
    it("should exist", () => {
        expect(Board).toBeDefined();
    });

    it("constructor builds board", () => {
        const board = new Board();

        expect(board.board.length).toBe(40);
        expect(board.board[0].length).toBe(10);
    });

    it("add tetronimo to board", () => {
        const board = new Board();
        const tetronimo = new Tetronimo(0, 0, "L");

        board.add(tetronimo);
        expect(board.board[0][0]).toBe(tetronimo);
    });

    it.only("return board tetronimos", () => {
        const board = new Board();
        const tetronimo1 = new Tetronimo(0, 0, "L");
        const tetronimo2 = new Tetronimo(4, 4, "L");
        const tetronimo3 = new Tetronimo(2, 2, "L");

        board.add(tetronimo1);
        expect(board.tetronimos).toEqual([tetronimo1]);

        board.add(tetronimo2);
        expect(board.tetronimos).toEqual([tetronimo1, tetronimo2]);

        board.add(tetronimo3);
        expect(board.tetronimos).toEqual([tetronimo1, tetronimo3, tetronimo2]);
    });

    it("moves down floating elements", () => {
        const board = new Board();
        const tetronimo = new Tetronimo(0, 0, "L");

        board.add(tetronimo);

        expect(board.board[0][0]).toBe(tetronimo);
        expect(board.board[0][0].y).toBe(0);
        expect(board.board[0][0].floating).toBe(true);
    });
});
