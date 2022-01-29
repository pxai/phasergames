import Board from "../src/board";

describe("Game class", () => {
    it("should exist", () => {
        expect(Board).to.not.equal(undefined);
    });

    it("should have constructor", () => {
        const board = new Board(7, 13);
        expect(board).not.to.equal(null);
    });

    it("should add elements to board", () => {
        const board = new Board(7, 13);
        board.addToBoard(2, 6, {letter: "A", points: 1});
        expect(board.positions[2][6].letter).to.equal("A");
        expect(board.positions[2][5]).to.equal(null);
    });

    describe("horizontal", () => {
        it("should get horizontal", () => {
            const board = new Board(7, 13);
            board.addToBoard(2, 3, {letter: "B", points: 1});
            board.addToBoard(2, 4, {letter: "A", points: 1});
            board.addToBoard(2, 5, {letter: "R", points: 1});
    
            expect(board.getHorizontal(2, 4)).to.equal("BAR");
            expect(board.getHorizontal(2, 3)).to.equal("BAR");
            expect(board.getHorizontal(2, 5)).to.equal("BAR");
        });

        it("should get horizontal when starts from 0", () => {
            const board = new Board(7, 13);
            board.addToBoard(2, 0, {letter: "B", points: 1});
            board.addToBoard(2, 1, {letter: "A", points: 1});
            board.addToBoard(2, 2, {letter: "R", points: 1});
    
            expect(board.getHorizontal(2, 0)).to.equal("BAR");
            expect(board.getHorizontal(2, 1)).to.equal("BAR");
            expect(board.getHorizontal(2, 2)).to.equal("BAR");
        });

        it("should get horizontal when ends ", () => {
            const board = new Board(7, 13);
            board.addToBoard(2, 4, {letter: "B", points: 1});
            board.addToBoard(2, 5, {letter: "A", points: 1});
            board.addToBoard(2, 6, {letter: "R", points: 1});
    
            expect(board.getHorizontal(2, 4)).to.equal("BAR");
            expect(board.getHorizontal(2, 5)).to.equal("BAR");
            expect(board.getHorizontal(2, 6)).to.equal("BAR");
        });
    })


    describe("vertical", () => {
        it("should get vertical", () => {
            const board = new Board(7, 13);
            board.addToBoard(3, 2, {letter: "B", points: 1});
            board.addToBoard(4, 2, {letter: "A", points: 1});
            board.addToBoard(5, 2, {letter: "R", points: 1});

            expect(board.getVertical(3, 2)).to.equal("BAR");
            expect(board.getVertical(4, 2)).to.equal("BAR");
            expect(board.getVertical(5, 2)).to.equal("BAR");
        });

        it("should get vertical when starts from 0", () => {
            const board = new Board(7, 13);
            board.addToBoard(0, 2, {letter: "B", points: 1});
            board.addToBoard(1, 2, {letter: "A", points: 1});
            board.addToBoard(2, 2, {letter: "R", points: 1});

            expect(board.getVertical(0, 2)).to.equal("BAR");
            expect(board.getVertical(1, 2)).to.equal("BAR");
            expect(board.getVertical(2, 2)).to.equal("BAR");
        });

        it("should get vertical when ends ", () => {
            const board = new Board(7, 13);
            board.addToBoard(10, 2, {letter: "B", points: 1});
            board.addToBoard(11, 2, {letter: "A", points: 1});
            board.addToBoard(12, 2, {letter: "R", points: 1});

            expect(board.getVertical(10, 2)).to.equal("BAR");
            expect(board.getVertical(11, 2)).to.equal("BAR");
            expect(board.getVertical(12, 2)).to.equal("BAR");
        });
    })

    it("should get words", () => {
        const board = new Board(7, 13);
        board.addToBoard(10, 3, {letter: "T", points: 1});
        board.addToBoard(9, 2, {letter: "B", points: 1});
        board.addToBoard(10, 2, {letter: "A", points: 1});
        board.addToBoard(11, 2, {letter: "R", points: 1});
        board.addToBoard(10, 1, {letter: "C", points: 1});

        expect(board.words(10, 2)).to.eql(["CAT", "BAR"]);
    });

    it("should get substrings", () => {
        const board = new Board(7, 13);
        
        expect(board.substrings("CAT")).to.eql(["CAT", "CA", "AT"])
    });
});
