class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.body = new Array(length).fill('O');
  }

  hit(coord) {
    this.body[coord] = 'X';

    return this;
  }

  isSunk() {
    return this.body.every((part) => part === 'X');
  }
}

export default Ship;
