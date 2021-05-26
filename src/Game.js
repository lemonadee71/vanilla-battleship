import { createState, html } from './component';
import Board from './components/Board';
import Ship from './modules/Ship';
import Gameboard from './modules/Gameboard';
import { doRandomAttack, doRandomPlacing } from './modules/Player';
import difficulty from './difficulty.json';
import allShipDetails from './ships.json';
import $, { determineCellClass } from './utils';
import PlayerBoard from './components/PlayerBoard';
import event from './event';

const Game = (mode, restartGame) => {
  const aiPastMoves = [];
  const currentTurn = createState(0);
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

  const syncCellToBoard =
    (player = 'player') =>
    ([x, y]) => ({
      $class: initBoard.bindValue(
        (state) =>
          `cell ${determineCellClass(
            state[player].get(x, y),
            player === 'player'
          )}`
      ),
    });

  const aiAttack = () => {
    const move = doRandomAttack(size, aiPastMoves).join('-');
    $(`[data-board-name="player"] .cell[data-pos="${move}"]`).click();
    aiPastMoves.push(move);
  };

  event.on('game over', (playerNum) => {
    alert(`player ${playerNum} lose!`);
    setTimeout(restartGame, 500);
  });
  event.on('next turn', () => {
    currentTurn.value = +!currentTurn.value;

    if (currentTurn.value) {
      setTimeout(aiAttack, 500);
    }
  });

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
                    cellProps: syncCellToBoard(),
                  })}
                  ${Board({
                    size,
                    board: initBoard.value.enemy.getBoard(),
                    cellProps: syncCellToBoard('enemy'),
                  })}
                </div>`
            : html`<div style="display: flex;">
                ${PlayerBoard(0, size, initBoard.value.player, currentTurn)}
                ${PlayerBoard(1, size, initBoard.value.enemy, currentTurn)}
              </div>`
        ),
      }}
    ></div>
  `;
};

export default Game;
