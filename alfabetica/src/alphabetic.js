import Generator from "./generator.js";

export default class Alphabetic extends Generator {
    constructor (sequence = "abcdefghijklmnopqrstuvwxyz")  {
      super(sequence.split(""));
    }
}
