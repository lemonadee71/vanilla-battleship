import { html } from '../component';
import { determineCellClass } from '../utils';

// TODO: make this a custom component if needed
const Board = ({
  number,
  size,
  board,
  clickHandler,
  additionalCellProps,
  additionalBoardProps = null,
}) =>
  html`<div
    class="grid"
    style="grid-template-columns: repeat(${size}, 1fr);"
    ${number ? `data-board-num="${number}"` : ''}
    ${clickHandler ? { onClick: clickHandler } : ''}
    ${additionalBoardProps || ''}
  >
    ${board
      .map((row, i) =>
        row.map(
          (cell, j) =>
            html`<div
              data-pos="${i}-${j}"
              class="cell ${determineCellClass(cell)}"
              ${additionalCellProps.call(null, [i, j])}
            ></div>`
        )
      )
      .flat()}
  </div>`;

export default Board;
