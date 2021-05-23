import { html } from '../component';

const Board = (size, board) => {
  const determineCellClass = (cell) => {
    switch (cell) {
      case 'HIT':
        return ' hit';
      case 'MISS':
        return ' missed';
      case 'SUNK':
        return ' sunk';
      case undefined:
        return ' occupied';
      case null:
        return '';
      default:
        return ' ship';
    }
  };

  return html`<div
    id="grid"
    style="grid-template-columns: repeat(${size}, 1fr);"
  >
    ${board
      .map((row, i) =>
        row.map(
          (cell, j) =>
            `<div
              data-pos="${`${i}-${j}`}"
              class="${`cell${determineCellClass(cell)}`}"
            ></div>`
        )
      )
      .flat()}
  </div>`;
};

export default Board;
