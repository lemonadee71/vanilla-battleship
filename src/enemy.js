import { doRandomAttack } from './modules/Player';
import $ from './utils';
import event from './event';

// TODO: ai is not really working
const createAI = (playerNumber, numberOfPlayers, boardSize) => {
  const pastMoves = [];
  const defeatedPlayers = [];

  const _determinePlayerToAttack = () => {
    let playerToAttack = '';

    do {
      playerToAttack = Math.floor(Math.random() * numberOfPlayers) + 1;
    } while (
      defeatedPlayers.includes(playerToAttack) &&
      playerToAttack !== playerNumber
    );

    return playerToAttack;
  };

  const _attack = (currentTurn) => {
    if (currentTurn !== playerNumber) return;

    console.log('ai attacking...');

    const playerToAttack = _determinePlayerToAttack();
    const move = doRandomAttack(boardSize, pastMoves).join('-');
    const cell = $(
      `[data-board-num="${playerToAttack}"] .cell[data-pos="${move}"]`
    );

    cell.click();
    pastMoves.push(move);

    console.log(playerToAttack, playerNumber, cell);
  };

  const _addDefeatedPlayer = (player) => defeatedPlayers.push(player);

  const init = () => {
    event.on('next turn', _attack);
    event.on('player defeated', _addDefeatedPlayer);
  };

  const destroy = () => {
    event.off('next turn', _attack);
    event.off('player defeated', _addDefeatedPlayer);
  };

  return {
    init,
    destroy,
  };
};

export default createAI;
