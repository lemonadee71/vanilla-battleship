import { createState, html } from './component';
import Board from './components/Board';
import Ship from './modules/Ship';
import Gameboard from './modules/Gameboard';
import { doRandomPlacing } from './modules/Player';
import difficulty from './difficulty.json';
import allShipDetails from './ships.json';
import { determineCellClass } from './utils';
import PlayerBoard from './components/PlayerBoard';
import event from './event';
import createAI from './enemy';

const Game = (mode, restardHandler) => {
  const currentTurn = { value: 'player' };
  const isFinishPlacing = createState(false);
  const { size, ships } = difficulty[mode];
  const ai = createAI(size);

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

    return currentBoard;
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

  const syncCell = ([x, y]) => ({
    $class: initBoard.bindValue(
      (state) => `cell ${determineCellClass(state.player.get(x, y), true)}`
    ),
  });

  const finishGame = (type) => {
    alert(`${type} wins!`);
    setTimeout(restartGame, 500);
  };

  const nextTurn = (type) => {
    currentTurn.value = type;
  };

  const restartGame = () => {
    event.off('game over', finishGame);
    event.off('next turn', nextTurn);
    ai.destroy();
    restardHandler();
  };

  event.on('game over', finishGame);
  event.on('next turn', nextTurn);
  ai.init();

  return html`
    <button ${{ onClick: restartGame }}>Restart</button>
    <div
      ${{
        $content: isFinishPlacing.bindValue((val) =>
          !val
            ? html`<button ${{ onClick: randomize }}>Randomize</button>
                <button ${{ onClick: finishPlacing }}>Finish placing</button>
                <div style="display: flex;">
                  ${Board({
                    size,
                    board: initBoard.value.player.getBoard(),
                    cellProps: syncCell,
                  })}
                </div>`
            : html`<div style="display: flex;">
                ${PlayerBoard(
                  'player',
                  size,
                  initBoard.value.player,
                  currentTurn
                )}
                ${PlayerBoard(
                  'enemy',
                  size,
                  initBoard.value.enemy,
                  currentTurn
                )}
              </div>`
        ),
      }}
    ></div>
  `;
};

export default Game;
