import { createState } from '../component';
import { determineCellClass } from '../utils';
import event from '../event';
import Board from './Board';

const PlayerBoard = (player, currentTurn, inTransition) => {
  const { id, type, number, gameboard } = player;
  const thisBoard = createState(gameboard.getBoard());

  const clickHandler = (e) => {
    if (
      !e.target.matches('.cell') ||
      number === currentTurn.value ||
      inTransition.value
    )
      return;

    try {
      const [x, y] = e.target.getAttribute('data-pos').split('-');

      gameboard.receiveAttack(x, y);
      thisBoard.value = gameboard.getBoard();

      if (gameboard.isGameOver()) {
        setTimeout(() => event.emit('player defeated', number), 300);
        return;
      }

      event.emit('attack received', number);
    } catch (error) {
      console.warn(error);
    }
  };

  const cellProps = ([x, y]) => ({
    $class: thisBoard.bindValue(
      (board) =>
        `cell ${determineCellClass(board[x][y], number === currentTurn.value)}`
    ),
  });

  return Board({
    number,
    clickHandler,
    cellProps,
    board: thisBoard.value,
    size: gameboard.size,
  });
};

export default PlayerBoard;
