import { html } from './component';
import { determineCellClass } from './utils';
import placeShipsInRandom from './placeShips';
import Board from './components/Board';

const PreGame = (playerBoard, size, ships, finish) => {
  const randomize = () => {
    playerBoard.value = placeShipsInRandom(size, ships);
  };

  const cellProps = ([x, y]) => ({
    $class: playerBoard.bindValue(
      (state) => `cell ${determineCellClass(state.get(x, y), true)}`
    ),
  });

  return html`<button ${{ onClick: randomize }}>Randomize</button>
    <button ${{ onClick: finish }}>Finish placing</button>
    <h2>Place your ships</h2>
    <div class="container">
      ${Board({
        size,
        cellProps,
        board: playerBoard.value.getBoard(),
      })}
    </div>`;
};

export default PreGame;
