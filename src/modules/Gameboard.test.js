import Gameboard from './Gameboard';
import Ship from './Ship';
import ships from '../ships.json';

describe('Gameboard', () => {
  const pos = [0, 0];
  let board;
  let ship;

  beforeEach(() => {
    board = Gameboard(5);
    ship = new Ship(ships.patrolBoat.name, ships.patrolBoat.length);
    const anotherShip = new Ship(ships.boat.name, ships.boat.length);

    board.placeShip({ ship, pos, direction: 'x' });
    board.placeShip({ ship: anotherShip, pos: [3, 0] });
  });

  afterEach(() => {
    board = null;
  });

  it('place ship on the board', () => {
    let shipLength = 0;
    for (let i = 0; i < ship.length; i++) {
      if (board.getBoard()[pos[0]][pos[1] + i].includes(ship.name)) {
        shipLength++;
      }
    }

    expect(shipLength).toBe(ship.length);
  });

  describe('does not allow placing ships', () => {
    let newShip;
    beforeEach(() => {
      newShip = new Ship(ships.destroyer.name, ships.destroyer.length);
    });

    it('on an occupied cell', () => {
      expect(() =>
        board.placeShip({ ship: newShip, pos: [0, 0], direction: 'y' })
      ).toThrowError('Cell occupied');
    });

    it('that can go off the board', () => {
      expect(() =>
        board.placeShip({ ship: newShip, pos: [3, 4], direction: 'y' })
      ).toThrowError('Ship off-bounds');
      console.table(board.getBoard());
    });

    it('next to each other', () => {
      expect(() =>
        board.placeShip({ ship: newShip, pos: [2, 1], direction: 'y' })
      ).toThrowError('Cell within a ship territory');
      console.table(board.getBoard());
    });
  });

  it('lets players attack', () => {
    board.receiveAttack(0, 0);

    expect(board.get(...pos)).toBe('HIT');
  });

  it('records attack even if miss', () => {
    board.receiveAttack(2, 0);

    expect(board.get(2, 0)).toBe('MISS');
  });

  it('knows when all ships are sunk', () => {
    board.receiveAttack(0, 0);
    board.receiveAttack(0, 1);
    board.receiveAttack(3, 0);
    board.receiveAttack(2, 0);
    board.receiveAttack(0, 3);

    expect(board.isGameOver()).toBe(true);
  });

  it('throws error when same cell is selected twice', () => {
    board.receiveAttack(0, 0);

    expect(() => board.receiveAttack(0, 0)).toThrowError();
  });
});
