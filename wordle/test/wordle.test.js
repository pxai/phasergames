import Wordle from "../src/wordle";

describe("Wordle class", () => {
    let defaultStatus;

    beforeEach(()=> {
        defaultStatus = [
            [{letter: "", color: ""},{letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}],
            [{letter: "", color: ""},{letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}],
            [{letter: "", color: ""},{letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}],
            [{letter: "", color: ""},{letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}],
            [{letter: "", color: ""},{letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}],
            [{letter: "", color: ""},{letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}, {letter: "", color: ""}]
        ];
    });

    it("should exist", () => {
        expect(Wordle).to.not.equal(undefined);
    });

    it("should have constructor", () => {
        const word = "pello";
        const wordle = new Wordle(word, 6);
        expect(wordle).not.to.equal(null);

        expect(wordle.word).to.equal(word);
        expect(wordle.length).to.equal(word.length);
        expect(wordle.attempts).to.equal(6);
        expect(wordle.current).to.equal(0);

        expect(wordle.status).to.eql(defaultStatus);
        expect(wordle.outcome).to.equal("playing")
    });

    it("should have constructor with default values", () => {
        const word = "pello";
        const wordle = new Wordle(word);
        expect(wordle).not.to.equal(null);

        expect(wordle.word).to.equal(word);
        expect(wordle.length).to.equal(word.length);
        expect(wordle.attempts).to.equal(6);
        expect(wordle.current).to.equal(0);

        expect(wordle.status).to.eql(defaultStatus);
        expect(wordle.outcome).to.equal("playing")
    });

    describe("guess", () => {
        let wordle;
        beforeEach(()=> {
            const word = "opera";
            wordle = new Wordle(word);
        });

        it("should change current one position", () => {
            expect(wordle.current).to.equal(0);

            wordle.guess("PELLO");

            expect(wordle.current).to.equal(1);
    
            wordle.guess("JULEN");

            expect(wordle.current).to.equal(2);
        });

        it("should change status one position", () => {
            expect(wordle.status).to.eql(defaultStatus);

            wordle.guess("ocaso");

            expect(wordle.status).to.eql([
                [{letter: "o", color: 0x00ff00},{letter: "c", color: 0xcccccc}, {letter: "a", color: 0xffa500}, {letter: "s", color: 0xcccccc}, {letter: "o", color: 0xcccccc}],
                ...(defaultStatus.slice(1, wordle.attempts))
            ]);
            expect(wordle.outcome).to.equal("playing")
        });

        it("should change status two positions", () => {
            expect(wordle.status).to.eql(defaultStatus);

            wordle.guess("ocaso");
            wordle.guess("opaca");

            expect(wordle.status).to.eql([
                [{letter: "o", color: 0x00ff00},{letter: "c", color: 0xcccccc}, {letter: "a", color: 0xffa500}, {letter: "s", color: 0xcccccc}, {letter: "o", color: 0xcccccc}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "a", color: 0xcccccc}, {letter: "c", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                ...(defaultStatus.slice(2, wordle.attempts))
            ]);
            expect(wordle.outcome).to.equal("playing")
        });

        it("should change status three positions", () => {
            expect(wordle.status).to.eql(defaultStatus);

            wordle.guess("ocaso");
            wordle.guess("opaca");
            wordle.guess("oprea");

            expect(wordle.status).to.eql([
                [{letter: "o", color: 0x00ff00},{letter: "c", color: 0xcccccc}, {letter: "a", color: 0xffa500}, {letter: "s", color: 0xcccccc}, {letter: "o", color: 0xcccccc}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "a", color: 0xcccccc}, {letter: "c", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "r", color: 0xffa500}, {letter: "e", color: 0xffa500}, {letter: "a", color: 0x00ff00}],
                ...(defaultStatus.slice(3, wordle.attempts))
            ]);
            expect(wordle.outcome).to.equal("playing")
        });

        it("should change status four positions and win", () => {
            expect(wordle.status).to.eql(defaultStatus);

            wordle.guess("ocaso");
            wordle.guess("opaca");
            wordle.guess("oprea");
            wordle.guess("opera");

            expect(wordle.status).to.eql([
                [{letter: "o", color: 0x00ff00},{letter: "c", color: 0xcccccc}, {letter: "a", color: 0xffa500}, {letter: "s", color: 0xcccccc}, {letter: "o", color: 0xcccccc}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "a", color: 0xcccccc}, {letter: "c", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "r", color: 0xffa500}, {letter: "e", color: 0xffa500}, {letter: "a", color: 0x00ff00}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "e", color: 0x00ff00}, {letter: "r", color: 0x00ff00}, {letter: "a", color: 0x00ff00}],
                ...(defaultStatus.slice(4, wordle.attempts))
            ]);

            expect(wordle.outcome).to.equal("win")
        });

        it("should change status 6 positions and lose", () => {
            expect(wordle.status).to.eql(defaultStatus);

            wordle.guess("ocaso");
            wordle.guess("opaca");
            wordle.guess("oprea");
            wordle.guess("aaaaa");


            expect(wordle.status).to.eql([
                [{letter: "o", color: 0x00ff00},{letter: "c", color: 0xcccccc}, {letter: "a", color: 0xffa500}, {letter: "s", color: 0xcccccc}, {letter: "o", color: 0xcccccc}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "a", color: 0xcccccc}, {letter: "c", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "r", color: 0xffa500}, {letter: "e", color: 0xffa500}, {letter: "a", color: 0x00ff00}],
                [{letter: "a", color: 0xcccccc},{letter: "a", color: 0xcccccc}, {letter: "a", color: 0xcccccc}, {letter: "a", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                ...(defaultStatus.slice(4, wordle.attempts))
            ]);

            expect(wordle.outcome).to.equal("playing")

            wordle.guess("aaaaa");
            defaultStatus.shift()
            expect(wordle.status).to.eql([
                [{letter: "o", color: 0x00ff00},{letter: "c", color: 0xcccccc}, {letter: "a", color: 0xffa500}, {letter: "s", color: 0xcccccc}, {letter: "o", color: 0xcccccc}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "a", color: 0xcccccc}, {letter: "c", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "r", color: 0xffa500}, {letter: "e", color: 0xffa500}, {letter: "a", color: 0x00ff00}],
                [{letter: "a", color: 0xcccccc},{letter: "a", color: 0xcccccc}, {letter: "a", color: 0xcccccc}, {letter: "a", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                [{letter: "a", color: 0xcccccc},{letter: "a", color: 0xcccccc}, {letter: "a", color: 0xcccccc}, {letter: "a", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                ...(defaultStatus.slice(4, wordle.attempts))
            ]);
            expect(wordle.outcome).to.equal("playing")


            wordle.guess("xxxxx");
            expect(wordle.status).to.eql([
                [{letter: "o", color: 0x00ff00},{letter: "c", color: 0xcccccc}, {letter: "a", color: 0xffa500}, {letter: "s", color: 0xcccccc}, {letter: "o", color: 0xcccccc}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "a", color: 0xcccccc}, {letter: "c", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "r", color: 0xffa500}, {letter: "e", color: 0xffa500}, {letter: "a", color: 0x00ff00}],
                [{letter: "a", color: 0xcccccc},{letter: "a", color: 0xcccccc}, {letter: "a", color: 0xcccccc}, {letter: "a", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                [{letter: "a", color: 0xcccccc},{letter: "a", color: 0xcccccc}, {letter: "a", color: 0xcccccc}, {letter: "a", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                [{letter: "x", color: 0xcccccc},{letter: "x", color: 0xcccccc}, {letter: "x", color: 0xcccccc}, {letter: "x", color: 0xcccccc}, {letter: "x", color: 0xcccccc}],
            ]);

            expect(wordle.outcome).to.equal("lose")
        });
    })

    describe("reset", () => {
        let wordle;
        beforeEach(()=> {
            const word = "opera";
            wordle = new Wordle(word);
        });

        it("should reset current status", () => {
            expect(wordle.status).to.eql(defaultStatus);

            wordle.guess("ocaso");

            expect(wordle.status).to.eql([
                [{letter: "o", color: 0x00ff00},{letter: "c", color: 0xcccccc}, {letter: "a", color: 0xffa500}, {letter: "s", color: 0xcccccc}, {letter: "o", color: 0xcccccc}],
                ...(defaultStatus.slice(1, wordle.attempts))
            ]);
            expect(wordle.current).to.equal(1)

            wordle.reset()

            expect(wordle.status).to.eql(defaultStatus);
            expect(wordle.current).to.equal(0)
            expect(wordle.outcome).to.equal("playing")
        });

        it("should reset current status after more than one", () => {
            expect(wordle.status).to.eql(defaultStatus);

            wordle.guess("ocaso");
            wordle.guess("opaca");
            wordle.guess("oprea");

            expect(wordle.status).to.eql([
                [{letter: "o", color: 0x00ff00},{letter: "c", color: 0xcccccc}, {letter: "a", color: 0xffa500}, {letter: "s", color: 0xcccccc}, {letter: "o", color: 0xcccccc}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "a", color: 0xcccccc}, {letter: "c", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "r", color: 0xffa500}, {letter: "e", color: 0xffa500}, {letter: "a", color: 0x00ff00}],
                ...(defaultStatus.slice(3, wordle.attempts))
            ]);

           wordle.reset()

            expect(wordle.status).to.eql([
                [{letter: "o", color: 0x00ff00},{letter: "c", color: 0xcccccc}, {letter: "a", color: 0xffa500}, {letter: "s", color: 0xcccccc}, {letter: "o", color: 0xcccccc}],
                [{letter: "o", color: 0x00ff00},{letter: "p", color: 0x00ff00}, {letter: "a", color: 0xcccccc}, {letter: "c", color: 0xcccccc}, {letter: "a", color: 0x00ff00}],
                ...(defaultStatus.slice(2, wordle.attempts))
            ]);
    
            expect(wordle.current).to.equal(2)
            expect(wordle.outcome).to.equal("playing")
        });
    })
});
