import PlayerBoard from './components/PlayerBoard';
import { createState, html } from './component';
import difficulty from './difficulty.json';
import $, { uuid } from './utils';
import randomizeBoard from './fns';
import event from './event';
import createAI from './enemy';
import PreGame from './PreGame';

const Game = (mode, numberOfEnemies, restartHandler) => {
  const isInTransition = { value: false };
  const isFinishPlacing = createState(false);
  const currentTurn = createState(1);

  const { size, ships } = difficulty[mode];
  const allPlayers = new Map();
  const defeatedPlayers = [];

  const playerBoard = createState({});

  const generatePlayers = () => {
    for (let i = 1; i < numberOfEnemies + 2; i++) {
      const id = uuid(4);
      const type = i === 1 ? 'human' : 'computer';
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
        gameboard: type === 'computer' ? randomizeBoard(size, ships) : null,
        isDefeated: false,
      });
    }
  };

  const announce = (text) => {
    $('#announcement').textContent = text;
  };

  const finishGame = () => {
    alert(`Player ${currentTurn.value} wins!`);
    event.emit('game over');
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

  const nextTurn = () => {
    isInTransition.value = true;
    // announce(`Player ${currentTurn.value} attacked Player ${target}`);

    do {
      currentTurn.value++;
    } while (defeatedPlayers.includes(currentTurn.value));

    if (currentTurn.value > numberOfEnemies + 1) {
      currentTurn.value = [...allPlayers.values()]
        .map((player) => player.number)
        .find((num) => !defeatedPlayers.includes(num));
    }

    setTimeout(() => {
      isInTransition.value = false;

      event.emit('next turn', currentTurn.value);
      announce(
        currentTurn.value === 1
          ? 'Your turn'
          : `Player ${currentTurn.value} turn`
      );
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
  event.on('game over', restartGame, { once: true });

  // Initialize players
  generatePlayers();
  [...allPlayers.values()].map((player) => player.init && player.init());

  const setPlayerBoard = (newBoard) => {
    playerBoard.value = newBoard;
  };

  const finishPlacing = () => {
    // TODO: Allow multiple placing for multiple players
    allPlayers.get(1).gameboard = playerBoard.value;
    isFinishPlacing.value = true;
  };

  return html`
    <button ${{ onClick: restartGame }}>Restart</button>
    <div
      ${{
        $content: isFinishPlacing.bindValue((val) =>
          !val
            ? PreGame(mode, setPlayerBoard, finishPlacing)
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
