import { createState } from '../component';
import { determineCellClass } from '../utils';
import event from '../event';
import Board from './Board';

const PlayerBoard = (player, currentTurn, inTransition) => {
  const { type, number, gameboard } = player;
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
        event.emit('player defeated', number);
      }

      event.emit('attack received', number);
    } catch (error) {
      console.warn(error);
    }
  };

  const additionalCellProps = ([x, y]) => ({
    $class: thisBoard.bindValue(
      (board) => `cell ${determineCellClass(board[x][y], type === 'human')}`
    ),
  });

  const additionalBoardProps = {
    '$style:border': currentTurn.bindValue((turn) =>
      turn === number ? '3px solid rgb(206, 18, 18)' : '3px solid black'
    ),
  };

  return Board({
    number,
    clickHandler,
    additionalCellProps,
    additionalBoardProps,
    board: thisBoard.value,
    size: gameboard.size,
  });
};

export default PlayerBoard;
