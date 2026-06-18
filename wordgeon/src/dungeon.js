import Word from './word';
import LETTERS from './letters.js';
import Dictionary from './dictionary';
import Foe from './foe';
import Chest from './chest';

const MAX_LENGTH = 6;

export default class Dungeon {
  constructor() {
    this.tiles = [];
    this.dictionary = new Dictionary();
    this.generate();
  }

  generate () {
    this.width = Phaser.Math.Between(3, MAX_LENGTH);
    this.height = Phaser.Math.Between(3, MAX_LENGTH);
    const size = this.width * this.height;
    const emptyTiles = 0 //Phaser.Math.Between(size/4, size/3);
    this.randomLetters = Array(size - emptyTiles).fill(0).map(_ => this.getRandomLetter());
    this.letters = this.randomLetters.concat(Array(emptyTiles).fill(0).map(_ => '_'));
    Phaser.Utils.Array.Shuffle(this.letters);
    this.tiles = [];

    for (let i=0; i< this.height; i++) {
      this.tiles[i] = [];
      for (let j=0; j < this.width; j ++) {
        const letter = this.letters[i * this.width + j]
        const chest = this.generateChest(letter);
        const foe = this.generateFoe(letter);
        this.tiles[i][j] = new Tile(i, j, letter, foe, chest);
      }
    }


    const playerCards = this.generatePlayerCards();
    console.log(`Dungeon: ${this.width} x ${this.height}:  ${this.tiles.flat().map(t => t.show())} \n ${playerCards}`);
    console.log(this.paintTiles())
  }

  paintTiles () {
    let result = '';
    for (let i = 0; i < this.height; i++) {
      result = this.tiles[i].reduce((acc, tile) => {
        return acc + '[' + (tile.letter ? tile.letter : ' ') + ']';
      }
      , result);
      result += '\n';
    }

    return result
  }


  generatePlayerCards () {
    const total = parseInt((this.width * this.height)/4)
    return Array(total).fill(0).map(_ => this.getRandomLetter());
  }


  getRandomLetter() {
    const letterPoints = LETTERS.en;

    const weightedLetters = [];
    for (const [letter, points] of Object.entries(letterPoints)) {
        const weight = 11 - points;
        for (let i = 0; i < weight; i++) {
            weightedLetters.push(letter);
        }
    }

    const randomIndex = Math.floor(Math.random() * weightedLetters.length);
    return weightedLetters[randomIndex];
  }

  checkWord(x, y, letters, isValidWord, minLength = 2, maxLength = 10) {
    const horizontalWord = letters.map(l => l.letter).join('');
    const horizontalWordReversed = letters.map(l => l.letter).reverse().join('');
    if (horizontalWord.length >= minLength) {
      console.log("checking: ", horizontalWord, horizontalWordReversed);
      if (isValidWord(horizontalWord)) {
        console.log("Found hor: ", { x: j, y: i, len: [1, 0], word: horizontalWord })
        results.push({x: j, y: i, len: [0, 1], word: horizontalWord});
      }
      if (isValidWord(horizontalWordReversed)) {
        console.log("Found horrever: ", { x: j, y: i, len: [-1, 0], word: horizontalWordReversed })
        results.push({x: j, y: i, len:  [0, -1], word: horizontalWordReversed});
      }
    }
  }

  setTileLetter(tile, letter) {
    tile.userSetsLetter(letter);
    console.log(this.paintTiles());
  }

  generateFoe (letter, difficulty) {
    return this.couldGenerateFoe(letter, difficulty)
  }

  generateChest (letter, difficulty) {
    return this.couldGenerateChest(letter, difficulty)
  }

  couldGenerateFoe (letter, difficulty = 0) {
    if (!['f', 'h', 'x', 'v','k'].includes(letter)) return false

    return Phaser.Math.Between(1, 10 - difficulty)
  }

  couldGenerateChest (letter, difficulty = 0) {
    if (!['q', 'z', 'x', 'j'].includes(letter)) return false

    return Phaser.Math.Between(1, 5 + difficulty)
  }
}

class Tile {
  constructor(x, y, letter, foe = null, chest = null) {
    this.x = x;
    this.y = y;
    this.letter = letter;
    if (foe) { console.log("Foe generated ", x, y)}
    this.foe = foe;
    if (chest) { console.log("Chest generated ", x, y)}
    this.chest = chest;
    this.selected = false;
  }

  setChest(chest) {
    this.chest = chest;
  }

  setFoe(foe) {
    this.foe = foe;
  }

  setLetter(letter) {
    this.letter = letter;
  }

  toggle () {
    console.log("Log in Dungeon Tile Class")
    this.selected = !this.selected
  }

  show () {
    return `[${this.x},${this.y}: ${this.letter}] ${this.selected ? 'SELECTED' : 'unselected'}`;
  }
}