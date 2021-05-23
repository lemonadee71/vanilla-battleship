import { makeMove, doRandomAttack, doRandomPlacing } from './Player';
import Gameboard from './Gameboard';
import Ship from './Ship';
import difficulty from '../difficulty.json';
import ships from '../ships.json';

describe('AI', () => {
  let size;
  let board;
  beforeEach(() => {
    size = difficulty.normal.size;
    board = Gameboard(size);
  });

  it('makes valid move', () => {
    expect(makeMove(size)[0]).toBeLessThanOrEqual(size);
  });

  it('does not make the same move', () => {
    const pastMoves = ['0-0', '1-0', '0-1'];

    expect(doRandomAttack(2, pastMoves).join('-')).toBe('1-1');
  });

  it('places ships randomly', () => {
    const ship = new Ship(ships.patrolBoat.name, ships.patrolBoat.length);
    const move = doRandomPlacing(size);

    expect(board.placeShip({ ship, ...move })).toBe(true);
  });
});
