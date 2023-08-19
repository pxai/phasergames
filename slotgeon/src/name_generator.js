export default class NameGenerator {
    constructor() {
      this.adjectives = ['Brave', 'Mighty', 'Swift', 'Wise', 'Fierce', 'Noble', 'Daring', 'Valiant'];
      this.nouns = ['Warrior', 'Knight', 'Mage', 'Ranger', 'Sorcerer', 'Paladin', 'Thief', 'Barbarian'];
      this.elvenNames = ['Eldrin', 'Lorien', 'Elara', 'Finian', 'Aeris', 'Sylas', 'Thalira', 'Caladwen'];
      this.dwarfNames = ['Thorin', 'Gimli', 'Durin', 'Faldin', 'Borin', 'Kazak', 'Thrain', 'Gromlin'];
      this.romanNames = ['Maximus', 'Julia', 'Aurelius', 'Octavia', 'Cassius', 'Livia', 'Valerius', 'Aelia'];
    }
  
    getRandomElement(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
  
    generateName() {
      const adjective = this.getRandomElement(this.adjectives);
      const noun = this.getRandomElement(this.nouns);
      const elvenName = this.getRandomElement(this.elvenNames);
      const dwarfName = this.getRandomElement(this.dwarfNames);
      const romanName = this.getRandomElement(this.romanNames);
  
      const randomNameType = Math.floor(Math.random() * 5); // 0: adjective + noun, 1: elven, 2: dwarf, 3: roman
  
      switch (randomNameType) {
        case 1:
          return elvenName;
        case 2:
          return dwarfName;
        case 3:
          return romanName;
        default:
          return `${adjective} ${noun}`;
      }
    }
  }

  