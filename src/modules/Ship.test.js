import Ship from './Ship';
import shipTypes from '../ships.json';

describe('Ship', () => {
  let ship;
  beforeEach(() => {
    ship = new Ship(shipTypes.destroyer.name, shipTypes.destroyer.length);
  });
  afterEach(() => {
    ship = null;
  });

  it('has a hit and isSunk function', () => {
    expect(ship.hit).toBeDefined();
    expect(ship.isSunk).toBeDefined();
  });

  it('marks the selected coordinate as hit', () => {
    ship.hit(1);
    expect(ship.body[1]).toBe('X');
    expect(ship.body[0]).not.toBe('X');
  });

  it('sinks when full length is hit', () => {
    ship.hit(0).hit(1).hit(2);
    expect(ship.isSunk()).toBe(true);
  });
});
