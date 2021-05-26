import { doRandomAttack } from './modules/Player';
import $ from './utils';
import event from './event';

const createAI = (boardSize) => {
  const pastMoves = [];

  const attack = (turn) => {
    if (turn === 'player') return;

    const move = doRandomAttack(boardSize, pastMoves).join('-');
    $(`[data-board-name="player"] .cell[data-pos="${move}"]`).click();
    pastMoves.push(move);
  };

  const init = () => {
    console.log('test');
    event.on('next turn', attack);
  };

  const destroy = () => {
    event.off('next turn', attack);
  };

  return {
    init,
    destroy,
  };
};

export default createAI;
