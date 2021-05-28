import { createState, html } from './component';
import Board from './components/Board';
import Ship from './modules/Ship';
import Gameboard from './modules/Gameboard';
import { doRandomPlacing } from './modules/Player';
import difficulty from './difficulty.json';
import allShipDetails from './ships.json';
import $, { determineCellClass, uuid } from './utils';
import PlayerBoard from './components/PlayerBoard';
import event from './event';
import createAI from './enemy';

const Game = (mode, numberOfEnemies, restartHandler) => {
  const isInTransition = { value: false };
  const isFinishPlacing = createState(false);
  const currentTurn = createState(1);

  const { size, ships } = difficulty[mode];
  const allPlayers = new Map();
  const defeatedPlayers = [];

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

  const generatePlayers = () => {
    for (let i = 1; i < numberOfEnemies + 2; i++) {
      const id = uuid(4);
      // TODO: allow users to choose the player type
      const type = i === 1 ? 'player' : 'computer';
      const { init, destroy } =
        type === 'computer'
          ? createAI(i, numberOfEnemies + 1, size)
          : { init: null, destroy: null };

      allPlayers.set(i, {
        id,
        type,
        init,
        destroy,
        number: i,
        gameboard: type === 'computer' ? placeShipsInRandom() : null,
        isDefeated: false,
      });
    }
  };

  const initBoard = createState({
    player: placeShipsInRandom(),
  });

  const randomize = () => {
    initBoard.value = {
      player: placeShipsInRandom(),
    };
  };

  const finishPlacing = () => {
    // TODO: Allow multiple placing for multiple players
    allPlayers.get(1).gameboard = initBoard.value.player;
    isFinishPlacing.value = true;
  };

  const announce = (text) => {
    $('#announcement').textContent = text;
  };

  const finishGame = () => {
    alert(`Player ${currentTurn.value} wins!`);
    restartGame();
    // setTimeout(restartGame, 500);
  };

  const playerDefeated = (playerNumber) => {
    defeatedPlayers.push(playerNumber);

    const player = allPlayers.get(playerNumber);
    player.isDefeated = true;

    if (player.destroy) player.destroy();

    const alive = [...allPlayers.values()].filter((p) => !p.isDefeated);
    const isGameOver = alive && alive.length === 1;

    alert(`Player ${playerNumber} is defeated`);

    if (!isGameOver) {
      $(`[data-board-num="${playerNumber}"`).remove();
    } else {
      finishGame();
    }
  };

  const nextTurn = (target) => {
    isInTransition.value = true;
    announce(`Player ${currentTurn.value} attacked Player ${target}`);

    do {
      currentTurn.value++;
    } while (defeatedPlayers.includes(currentTurn.value));

    if (currentTurn.value > numberOfEnemies + 1) {
      currentTurn.value = [...allPlayers.values()]
        .map((player) => player.number)
        .filter((num) => !defeatedPlayers.includes(num))[0];
    }

    setTimeout(() => {
      isInTransition.value = false;

      event.emit('next turn', currentTurn.value);
      announce(`Player ${currentTurn.value} turn`);
    }, 300);
  };

  const restartGame = () => {
    event.off('player defeated', playerDefeated);
    event.off('attack received', nextTurn);
    [...allPlayers.values()].map(
      (player) => player.destroy && player.destroy()
    );
    restartHandler();
  };

  // Initialize game
  event.on('player defeated', playerDefeated);
  event.on('attack received', nextTurn);

  // Initialize players
  generatePlayers();
  [...allPlayers.values()].map((player) => player.init && player.init());

  const cellProps = ([x, y]) => ({
    $class: initBoard.bindValue(
      (state) => `cell ${determineCellClass(state.player.get(x, y), true)}`
    ),
  });

  return html`
    <button ${{ onClick: restartGame }}>Restart</button>
    <div
      ${{
        $content: isFinishPlacing.bindValue((val) =>
          !val
            ? html`<button ${{ onClick: randomize }}>Randomize</button>
                <button ${{ onClick: finishPlacing }}>Finish placing</button>
                <h2>Place your ships</h2>
                <div class="container">
                  ${Board({
                    size,
                    cellProps,
                    board: initBoard.value.player.getBoard(),
                  })}
                </div>`
            : html`<h2 id="announcement">Player ${currentTurn.value} turn</h2>
                <div class="container">
                  ${[...allPlayers.values()].map((player) =>
                    PlayerBoard(player, currentTurn, isInTransition)
                  )}
                </div>`
        ),
      }}
    ></div>
  `;
};

export default Game;
