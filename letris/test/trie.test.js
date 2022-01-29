import Trie from "../src/trie";

describe("Trie class", () => {
    it("should exist", () => {
        expect(Trie).to.not.equal(undefined);
    });

    it("should have constructor", () => {
        const trie = new Trie();
        expect(trie).not.to.equal(null);
    });

    it("should have default current", () => {
        const trie = new Trie();
        expect(trie.current).to.equal("^");
    });

    it("should have default children", () => {
        const trie = new Trie();
        expect(trie.children.size).to.equal(0);
        expect(Array.from(trie.children)).to.eql([]);
    });

    describe("isCurrent", () => {
        it("should return true if current is the same char", () => {
            const trie = new Trie();
    
            expect(trie.isCurrent("^")).to.equal(true);
        });

        it("should return false if current is NOT the same char", () => {
            const trie = new Trie();
    
            expect(trie.isCurrent("A")).to.equal(false);
        });
    })

    describe("getChild", () => {
        it("should return null if children empty", () => {
            const trie = new Trie();

            expect(trie.getChild("a")).to.equal(null);
        });

        it("should return null if letter does not exist", () => {
            const trie = new Trie();

            expect(trie.getChild("a")).to.equal(null);
        });

        it("should return a true if letter exists", () => {
            const trie = new Trie();

            trie.insert("a");
            expect(trie.getChild("a").current).to.equal("a");
        });
    });

    describe("insert", () => {
        it("should be able to insert a word", () => {
            const trie = new Trie();
            trie.insert("cat")
            //expect(trie.search("cat")).to.equal(true);

        });
    });

    describe("isNext", () => {
        it("should return false if next is NOT the same char", () => {
            const trie = new Trie();
    
            expect(trie.isCurrent("A")).to.equal(false);
        });
    });

    describe("search", () => {
        it("should returns true if search term is empty", () => {
            const trie = new Trie();
            trie.insert("cat")
            expect(trie.search("cat")).to.equal(true);
        });

        it("should returns false if search term is not found", () => {
            const trie = new Trie();
    
            expect(trie.search("cat")).to.equal(false);
        });

        it("should returns true if search term is found", () => {
            const trie = new Trie();
            trie.insert("car")
            trie.insert("ca")

            expect(trie.search("car")).to.equal(true);
            expect(trie.search("ca")).to.equal(true);
        });
    });

   /* describe("read load", () => {
        it("should load a real dictionary", () => {
            const trie = new Trie();
            trie.load();
            expect(trie.search("car")).to.equal(true);
        });
    });*/
});
