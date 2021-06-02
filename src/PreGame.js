import { createState, html } from './component';
import { determineCellClass } from './utils';
import randomizeBoard from './fns';
import shipDetails from './ships.json';
import difficulty from './difficulty.json';
import Board from './components/Board';
import Gameboard from './modules/Gameboard';
import Ship from './modules/Ship';

const PreGame = (mode, setPlayerBoard, finish) => {
  const { size, ships } = difficulty[mode];
  let thisGameBoard = Gameboard(size);

  const currentBoard = createState(thisGameBoard);
  const allShips = createState({});
  const currentShip = createState({});

  const initAllShips = () =>
    ships.forEach((ship) => {
      allShips.value[ship.name] = ship.number;
    });

  const initCurrentShip = () => {
    const initCoord = { x: null, y: null, direction: null };

    currentShip.value.type = null;
    currentShip.value.coordinates = { head: initCoord, tail: initCoord };
  };

  // Initialize
  initAllShips();
  initCurrentShip();

  const determineCoordinates = (pos, direction) => {
    const shipLength = shipDetails[currentShip.value.type].length;
    const [row, col] = pos.split('-');
    const maxRow = Math.min(
      +row + (direction === 'y' ? shipLength - 1 : 0),
      size - 1
    );
    const maxCol = Math.min(
      +col + (direction === 'x' ? shipLength - 1 : 0),
      size - 1
    );

    currentShip.value.coordinates = {
      direction,
      head: { row: +row, col: +col },
      tail: { row: maxRow, col: maxCol },
    };
  };

  const additionalCellProps = ([row, col]) => [
    {
      $class: currentBoard.bindValue(
        (state) => `cell ${determineCellClass(state.get(row, col), true)}`
      ),
      '$style:backgroundColor': currentShip.bind('coordinates', (coords) => {
        const { head, tail, direction } = coords;

        const isWithinRow =
          direction === 'y'
            ? row >= head.row && row <= tail.row
            : row === head.row;
        const isWithinColumn =
          direction === 'y'
            ? col === head.col
            : col >= head.col && col <= tail.col;

        if (isWithinRow && isWithinColumn) return 'blue';

        return 'white';
      }),
    },
    {
      onMouseOver: (e) => {
        if (!currentShip.value.type) return;

        const pos = e.target.getAttribute('data-pos');
        const direction = e.ctrlKey ? 'x' : 'y';
        determineCoordinates(pos, direction);
      },
    },
  ];

  const selectShip = (e) => {
    currentShip.value.type = e.target.getAttribute('data-name');
  };

  const placeShip = (e) => {
    if (!e.target.matches('.cell')) return;

    try {
      const { name, length } = shipDetails[currentShip.value.type];
      const ship = new Ship(name, length);
      const pos = e.target
        .getAttribute('data-pos')
        .split('-')
        .map((num) => +num);

      thisGameBoard.placeShip({
        ship,
        pos,
        direction: currentShip.value.coordinates.direction,
      });

      currentBoard.value = thisGameBoard;

      const shipCount = allShips.value[currentShip.value.type];
      allShips.value[currentShip.value.type] = shipCount - 1;

      initCurrentShip();
    } catch (error) {
      console.warn(error.toString());
    }
  };

  const randomize = () => {
    thisGameBoard = randomizeBoard(size, ships);
    currentBoard.value = thisGameBoard;

    initCurrentShip();
    ships.forEach((ship) => {
      allShips.value[ship.name] = 0;
    });
  };

  const reset = () => {
    thisGameBoard.reset();
    currentBoard.value = thisGameBoard;

    initCurrentShip();
    initAllShips();
  };

  const finishPlacing = () => {
    const remainingShips = Object.values(allShips.value).reduce(
      (a, b) => a + b
    );

    if (remainingShips !== 0) {
      alert(`Please position the ${remainingShips} remaining ships`);
      return;
    }

    setPlayerBoard(currentBoard.value);
    finish();
  };

  return html`<button ${{ onClick: randomize }}>Randomize</button>
    <button ${{ onClick: reset }}>Reset</button>
    <button ${{ onClick: finishPlacing }}>Finish placing</button>
    <h2>Place your ships (hold ctrl key to switch direction)</h2>
    <div>
      ${ships.map(
        (ship) =>
          html`<button
            data-name="${ship.name}"
            ${{ onClick: selectShip }}
            ${{
              '$style:border': currentShip.bind('type', (shipName) =>
                shipName === ship.name ? '1px solid red' : ''
              ),
              $disabled: allShips.bind(ship.name, (value) => !value),
              $textContent: allShips.bind(
                ship.name,
                (num) => `${ship.name} (${num})`
              ),
            }}
          ></button>`
      )}
    </div>
    <div class="container">
      ${Board({
        size,
        additionalCellProps,
        clickHandler: placeShip,
        board: currentBoard.value.getBoard(),
      })}
    </div> `;
};

export default PreGame;
