import { createState, html } from './component';
import Board from './components/Board';
import Ship from './modules/Ship';
import Gameboard from './modules/Gameboard';
import { doRandomPlacing } from './modules/Player';
import difficulty from './difficulty.json';
import allShipDetails from './ships.json';

const Game = (mode, restartGame) => {
  const isFinishPlacing = createState(false);
  const { size, ships } = difficulty[mode];

  const placeShipsInRandom = () => {
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

    return currentBoard.getBoard();
  };

  const initBoard = createState({
    player: placeShipsInRandom(),
    enemy: placeShipsInRandom(),
  });

  const randomize = () => {
    initBoard.value = {
      player: placeShipsInRandom(),
      enemy: placeShipsInRandom(),
    };
  };

  const finishPlacing = () => {
    isFinishPlacing.value = true;
  };

  return html`
    <button ${{ onClick: restartGame }}>Restart</button>
    <div
      ${{
        $content: isFinishPlacing.bindValue((val) =>
          !val
            ? html`<button ${{ onClick: randomize }}>Randomize</button>
                <button ${{ onClick: finishPlacing }}>Finish placing</button>
                <div
                  style="display: flex;"
                  ${{
                    $content: initBoard.bindValue(
                      (state) =>
                        html`${Board(size, state.player)}
                        ${Board(size, state.enemy)}`
                    ),
                  }}
                ></div>`
            : html`<h2>Hello World</h2>`
        ),
      }}
    ></div>
  `;
};

export default Game;
