import Ship from './modules/Ship';
import Gameboard from './modules/Gameboard';
import { doRandomPlacing } from './modules/Player';
import allShipDetails from './ships.json';

const randomizeBoard = (size, ships) => {
  const currentBoard = Gameboard(size);

  const allShips = [...ships];
  let currentShip = null;

  while (allShips.length) {
    currentShip = allShips.shift();

    let currentCount = currentShip.number;
    while (currentCount) {
      const move = doRandomPlacing(size);
      const shipDetails = allShipDetails[currentShip.name];
      const ship = new Ship(shipDetails.name, shipDetails.length);

      try {
        currentBoard.placeShip({ ship, ...move });
        currentCount -= 1;
      } catch (error) {
        // console.warn(error.toString());
        continue;
      }
    }
  }

  return currentBoard;
};

export default randomizeBoard;
