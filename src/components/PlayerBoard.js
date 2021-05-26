import { createState } from '../component';
import { determineCellClass } from '../utils';
import event from '../event';
import Board from './Board';

const PlayerBoard = (type, size, gameboard, currentTurn) => {
  const thisBoard = createState(gameboard.getBoard());

  const clickHandler = (e) => {
    if (!e.target.matches('.cell')) return;
    if (type === currentTurn.value) return;

    try {
      const [x, y] = e.target.getAttribute('data-pos').split('-');

      gameboard.receiveAttack(x, y);
      thisBoard.value = gameboard.getBoard();

      if (gameboard.isGameOver()) {
        setTimeout(() => event.emit('game over', type), 300);
        return;
      }

      event.emit('next turn');
    } catch (error) {
      console.warn(error.toString());
    }
  };

  const syncCell = ([x, y]) => ({
    $class: thisBoard.bindValue(
      (board) => `cell ${determineCellClass(board[x][y], !type)}`
    ),
  });

  return Board({
    size,
    clickHandler,
    name: !type ? 'player' : 'enemy',
    board: thisBoard.value,
    cellProps: syncCell,
  });
};

export default PlayerBoard;
