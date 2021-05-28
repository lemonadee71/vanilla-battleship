import { doRandomAttack } from './modules/Player';
import $ from './utils';
import event from './event';

const createAI = (playerNumber, numberOfPlayers, boardSize) => {
  const allMoves = [...new Array(numberOfPlayers).fill(null)].map((arr, i) => ({
    number: i + 1,
    pastMoves: [],
  }));
  const defeatedPlayers = [];

  const _determinePlayerToAttack = () => {
    let playerToAttack = '';

    do {
      playerToAttack = Math.floor(Math.random() * numberOfPlayers) + 1;
    } while (
      defeatedPlayers.includes(playerToAttack) ||
      playerToAttack === playerNumber
    );

    return playerToAttack;
  };

  const _attack = (currentTurn) => {
    if (currentTurn !== playerNumber) return;

    const playerToAttack = _determinePlayerToAttack();
    const { pastMoves } = allMoves.find((obj) => obj.number === playerToAttack);
    const move = doRandomAttack(boardSize, pastMoves).join('-');
    const cell = $(
      `[data-board-num="${playerToAttack}"] .cell[data-pos="${move}"]`
    );

    pastMoves.push(move);

    if (['cell hit', 'cell missed'].includes(cell.className)) {
      _attack(currentTurn);
      return;
    }

    cell.click();

    console.log(
      `Player ${playerNumber} attacks cell ${move} of player ${playerToAttack}'s board`
    );
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
