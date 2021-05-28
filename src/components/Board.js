import { html } from '../component';
import { determineCellClass } from '../utils';

// TODO: make this a custom component if needed
const Board = ({
  number,
  size,
  board,
  clickHandler,
  boardProps = null,
  cellProps,
}) =>
  html`<div
    class="grid"
    style="grid-template-columns: repeat(${size}, 1fr);"
    ${number ? `data-board-num="${number}"` : ''}
    ${{ onClick: clickHandler }}
    ${boardProps || ''}
  >
    ${board
      .map((row, i) =>
        row.map(
          (cell, j) =>
            html`<div
              data-pos="${i}-${j}"
              class="cell ${determineCellClass(cell)}"
              ${cellProps.call(null, [i, j])}
            ></div>`
        )
      )
      .flat()}
  </div>`;

export default Board;
