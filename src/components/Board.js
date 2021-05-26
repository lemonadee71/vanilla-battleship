import { html } from '../component';
import { determineCellClass } from '../utils';

const Board = ({ number, size, board, clickHandler, cellProps }) =>
  html`<div
    class="grid"
    style="grid-template-columns: repeat(${size}, 1fr);"
    ${number ? `data-board-num="${number}"` : ''}
    ${{ onClick: clickHandler }}
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
