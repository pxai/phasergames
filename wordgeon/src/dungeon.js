import Word from './word';
import LETTERS from './letters.js';
import Dictionary from './dictionary';

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
        this.tiles[i][j] = new Tile(i, j, this.letters[i * this.width + j]);
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

  findValidWords(x, y) {
    const word = new Word(this.dictionary);
    const isValidWord = word.isValid.bind(word);
    return this.findValidWordsWithPaths(this.tiles, x, y,  isValidWord);
  }

  findValidWordsWithPaths(matrix, x, y, isValidWord, minLength = 2, maxLength = 10) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const results = [];

    const directions = [
      [1, 0], // down
      [-1, 0], // up
      [0, 1], // right
      [0, -1], // left
      [1, 1], // down-right
      [-1, -1], // up-left
      [1, -1], // down-left
      [-1, 1], // up-right
    ]

    // Iterate over each direction
    for (const [dx, dy] of directions) {
      let letters = [];
      let currentX = x;
      let currentY = y;

      // Traverse in the current direction
      while (
          currentX >= 0 &&
          currentX < rows &&
          currentY >= 0 &&
          currentY < cols &&
          letters.length < maxLength
      ) {
          letters.push(matrix[currentX][currentY]);

          const word = letters.map(l => l.letter).join('');
          const reversedWord = letters.map(l => l.letter).reverse().join('');
          console.log("Checking: ", word, reversedWord);
          if (word.length >= minLength) {
              if (isValidWord(word)) {
                  results.push({ x: currentX, y: currentY, len: [dx, dy], word });
              }
              if (isValidWord(reversedWord)) {
                  results.push({ x: currentX, y: currentY, len: [-dx, -dy], word: reversedWord });
              }
          }

          // Move to the next tile in the current direction
          currentX += dx;
          currentY += dy;
      }
  }

    results.sort((a, b) => {
      const aLength = a.word.length;
      const bLength = b.word.length;
      if (aLength === bLength) {
        return a.word.localeCompare(b.word);
      }
      return aLength - bLength;
    });

    console.log("results: ", results);


    return results;
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
}

class Tile {
  constructor(x, y, letter, user = false, item = null) {
    this.x = x;
    this.y = y;
    this.letter = letter;
    this.user = user;
    this.item = item;
    this.selected = false;
  }

  setItem(item) {
    this.item = item;
  }

  setLetter(letter) {
    this.letter = letter;
  }

  userSetsLetter(letter) {
    this.letter = letter;
    this.user = true;
  }

  toggle () {
    console.log("Log in Dungeon Tile Class")
    this.selected = !this.selected
  }

  show () {
    return `[${this.x},${this.y}: ${this.letter}] ${this.selected ? 'SELECTED' : 'unselected'}`;
  }
}