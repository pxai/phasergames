import en from "./dicts/en";

export default class Trie {
    constructor (parent, letter = "^", children) {
        this.parent = parent;
        if (this.parent) this.parent.children.add(this);

        this.letter = letter.toLowerCase();
        this.children = children ? children : new Set();
    }

    load(path = "en") {
        const start =  Date.now();
        en.forEach(word => {
            if (word.indexOf("'") === -1)
                this.insert(word);
        })
        const finish = Date.now();
        console.log("Lets see: ", (finish - start)/1000, " secs, " ,this.search("car"))
    }

    get current () {
        return this.letter;
    }

    isCurrent(char) {
        return this.letter === char;
    }

    getChild(letter) {
        if (this.children.size === 0) return null;
        for (let trie of this.children)
            if (trie.letter === letter) return trie;
    
        return null;
    }


    insert(word) {
        let next = this;
        word.split("").forEach( letter => {
            let child = next.getChild(letter);

            if (!child) {
                next = new Trie(next, letter)
            } else {
                next = child;
            }
        })

        next.children.add(new Trie(next, "="))
    }

    search (word) {
        if (!word) return true;

        word = "^" + word.toLowerCase() + "=";
        return this._search(this, word) !== null;
    }

    _search(trie, word) {
        if (trie.isCurrent(word[0])) {
            if (word.length > 1) {
                for (let t of trie.children) {
                    if (t.isCurrent(word[1])) {
                        return this._search(t, word.substring(1));
                    }
                }
                return null;
            } else {
                return trie;
            }
        } else {
            return null;
        }
    }
}