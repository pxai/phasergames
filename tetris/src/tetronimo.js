
import shapes from "./shapes";

export default class Tetromino {
    constructor (x, y, shape, color = "red") {
        this.x = x;
        this.y = y;
        this.name = color + Math.random()
        this.color = color;
        this.shape = shape;
        this.rotation = 0;
        this.#loadPositions();
        this.floating = true;
    }

    #loadPositions () {
        this.positions = shapes[this.shape].map(positions => [...positions]);
    }

    right () {
        if (!this.floating) return;
        this.x++;
    }

    left () {
        if (!this.floating) return;
        this.x--;
    }

    rotateLeft () {
        if (!this.floating) return;
        this.rotation = this.rotation === 0 ? 3 : this.rotation - 1;
    }

    rotateRight () {
        if (!this.floating) return;
        this.rotation = this.rotation === 3 ? 0 : this.rotation + 1;
    }

    get current() {
        return this.positions[this.rotation];
    }

    get absolute() {
        return [
            ...this.positions[this.rotation].map(position => ({x: this.x + position.x, y: this.y + position.y}))];
    }

    get bottomParts () {
        const partial = this.current.filter(position => !this.current.some(current => current.x === position.x && current.y === position.y + 1));
        return partial.sort((pointA, pointB) => pointB.y - pointA.y);
    }

    get lowest () {
        return this.bottomParts[0].y + this.y;
    }

    get rightest () {
        return this.rightParts[0].x + this.x;
    }

    get leftest () {
        return this.x - this.leftParts[0].x;
    }

    get rightParts () {
        const partial = [...this.current].sort((pointA, pointB) => pointB.x - pointA.x);
        return [partial[0], ...partial.slice(1, 4).filter(point => point.x === partial[0].x)]
    }

    get leftParts () {
        const partial = [...this.current].sort((pointA, pointB) => pointA.x - pointB.x);
        return [partial[0], ...partial.slice(1, 4).filter(point => point.x === partial[0].x)]
    }

    get collidingBottom () {
        return this.bottomParts && this.bottomParts.map(part => ({x: this.x + part.x, y: this.y + part.y + 1}));
    }

    get collidingLeft () {
        return this.leftParts.map(part => ({x: this.x + part.x - 1, y: this.y + part.y}));
    }

    get collidingRight () {
        return this.rightParts.map(part => ({x: this.x + part.x + 1, y: this.y + part.y}));
    }

    removePosition ({x, y}) {
        const indexOf = this.absolute.findIndex(position => position.x === x && position.y === y);
        this.positions[this.rotation].splice(indexOf, 1); //= this.positions[this.rotation].filter((position,i)=>  i !== indexOf)
       //this.#correctCenter();
    }

    #hasCenter() {
        return this.current.some(position => position.x === 0  && position.y === 0)
    }

    #correctCenter () {
        if (!this.#hasCenter()) {
            const remaining = this.current.filter(position => position.y < 0);
            remaining[0] = {x: 0, y: 0};

            for (let i = 1; i <= remaining.slice(1).length;i++) {
                remaining[i] = {x: remaining[i].x, y: remaining[i].y + 1}
            }

            this.positions[this.rotation] = remaining;
            this.y--;
        }
    }
}
