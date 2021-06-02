/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game */ "./src/Game.js");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component */ "./src/component.js");



const App = () => {
  const isGameStart = (0,_component__WEBPACK_IMPORTED_MODULE_1__.createState)(false);
  const defaultMode = 'normal';
  let mode = defaultMode;
  let numberOfEnemies = 1;

  const changeMode = (e) => {
    mode = e.target.value;
  };

  const startGame = () => {
    if (numberOfEnemies > 9) {
      alert('Max number of enemies is 9.');
      return;
    }

    isGameStart.value = true;
  };

  const restartGame = () => {
    isGameStart.value = false;
    mode = defaultMode;
    numberOfEnemies = 1;
  };

  const changeNumberOfEnemies = (e) => {
    numberOfEnemies = +e.target.value;
  };

  return _component__WEBPACK_IMPORTED_MODULE_1__.html`<div>
    <h1 class="title">Battleship</h1>
    <div
      ${{
        $content: isGameStart.bindValue((val) =>
          !val
            ? _component__WEBPACK_IMPORTED_MODULE_1__.html`
                <label for="mode">Choose difficulty:</label>
                <select name="mode" ${{ onChange: changeMode }}>
                  <!-- <option value="test" selected>Test</option> -->
                  <option value="normal">Normal</option>
                  <option value="medium">Intermediate</option>
                  <option value="hard">Hard</option>
                </select>
                <label for="noOfEnemies">Number of enemy computer:</label>
                <input
                  name="noOfEnemies"
                  placeholder="Max: 9"
                  type="number"
                  min="1"
                  max="9"
                  style="width: 70px;"
                  ${{ onChange: changeNumberOfEnemies }}
                />
                <button ${{ onClick: startGame }}>Start game</button>
              `
            : _component__WEBPACK_IMPORTED_MODULE_1__.html`${(0,_Game__WEBPACK_IMPORTED_MODULE_0__.default)(mode, numberOfEnemies, restartGame)}`
        ),
      }}
    ></div>
  </div>`;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);


/***/ }),

/***/ "./src/Game.js":
/*!*********************!*\
  !*** ./src/Game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_PlayerBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/PlayerBoard */ "./src/components/PlayerBoard.js");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component */ "./src/component.js");
/* harmony import */ var _difficulty_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./difficulty.json */ "./src/difficulty.json");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _fns__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./fns */ "./src/fns.js");
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./event */ "./src/event.js");
/* harmony import */ var _enemy__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./enemy */ "./src/enemy.js");
/* harmony import */ var _PreGame__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PreGame */ "./src/PreGame.js");









const Game = (mode, numberOfEnemies, restartHandler) => {
  const isInTransition = { value: false };
  const isFinishPlacing = (0,_component__WEBPACK_IMPORTED_MODULE_1__.createState)(false);
  const currentTurn = (0,_component__WEBPACK_IMPORTED_MODULE_1__.createState)(1);

  const { size, ships } = _difficulty_json__WEBPACK_IMPORTED_MODULE_2__[mode];
  const allPlayers = new Map();
  const defeatedPlayers = [];

  const playerBoard = (0,_component__WEBPACK_IMPORTED_MODULE_1__.createState)({});

  const generatePlayers = () => {
    for (let i = 1; i < numberOfEnemies + 2; i++) {
      const id = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.uuid)(4);
      const type = i === 1 ? 'human' : 'computer';
      const { init, destroy } =
        type === 'computer'
          ? (0,_enemy__WEBPACK_IMPORTED_MODULE_6__.default)(i, numberOfEnemies + 1, size)
          : { init: null, destroy: null };

      allPlayers.set(i, {
        id,
        type,
        init,
        destroy,
        number: i,
        gameboard: type === 'computer' ? (0,_fns__WEBPACK_IMPORTED_MODULE_4__.default)(size, ships) : null,
        isDefeated: false,
      });
    }
  };

  const announce = (text) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_3__.default)('#announcement').textContent = text;
  };

  const finishGame = () => {
    alert(`Player ${currentTurn.value} wins!`);
    _event__WEBPACK_IMPORTED_MODULE_5__.default.emit('game over');
  };

  const playerDefeated = (playerNumber) => {
    defeatedPlayers.push(playerNumber);

    const player = allPlayers.get(playerNumber);
    player.isDefeated = true;

    if (player.destroy) player.destroy();

    const alive = [...allPlayers.values()].filter((p) => !p.isDefeated);
    const isGameOver = alive && alive.length === 1;

    alert(`Player ${playerNumber} is defeated`);

    if (!isGameOver) {
      (0,_utils__WEBPACK_IMPORTED_MODULE_3__.default)(`[data-board-num="${playerNumber}"`).remove();
    } else {
      finishGame();
    }
  };

  const nextTurn = () => {
    isInTransition.value = true;
    // announce(`Player ${currentTurn.value} attacked Player ${target}`);

    do {
      currentTurn.value++;
    } while (defeatedPlayers.includes(currentTurn.value));

    if (currentTurn.value > numberOfEnemies + 1) {
      currentTurn.value = [...allPlayers.values()]
        .map((player) => player.number)
        .find((num) => !defeatedPlayers.includes(num));
    }

    setTimeout(() => {
      isInTransition.value = false;

      _event__WEBPACK_IMPORTED_MODULE_5__.default.emit('next turn', currentTurn.value);
      announce(
        currentTurn.value === 1
          ? 'Your turn'
          : `Player ${currentTurn.value} turn`
      );
    }, 300);
  };

  const restartGame = () => {
    _event__WEBPACK_IMPORTED_MODULE_5__.default.off('player defeated', playerDefeated);
    _event__WEBPACK_IMPORTED_MODULE_5__.default.off('attack received', nextTurn);
    [...allPlayers.values()].map(
      (player) => player.destroy && player.destroy()
    );
    restartHandler();
  };

  // Initialize game
  _event__WEBPACK_IMPORTED_MODULE_5__.default.on('player defeated', playerDefeated);
  _event__WEBPACK_IMPORTED_MODULE_5__.default.on('attack received', nextTurn);
  _event__WEBPACK_IMPORTED_MODULE_5__.default.on('game over', restartGame, { once: true });

  // Initialize players
  generatePlayers();
  allPlayers.forEach((player) => player.init && player.init());

  const setPlayerBoard = (newBoard) => {
    playerBoard.value = newBoard;
  };

  const finishPlacing = () => {
    // TODO: Allow multiple placing for multiple players
    allPlayers.get(1).gameboard = playerBoard.value;
    isFinishPlacing.value = true;
  };

  return _component__WEBPACK_IMPORTED_MODULE_1__.html`
    <button ${{ onClick: restartGame }}>Restart</button>
    <div
      ${{
        $content: isFinishPlacing.bindValue((val) =>
          !val
            ? (0,_PreGame__WEBPACK_IMPORTED_MODULE_7__.default)(mode, setPlayerBoard, finishPlacing)
            : _component__WEBPACK_IMPORTED_MODULE_1__.html`<h2 id="announcement">Player ${currentTurn.value} turn</h2>
                <div class="container">
                  ${[...allPlayers.values()].map((player) =>
                    (0,_components_PlayerBoard__WEBPACK_IMPORTED_MODULE_0__.default)(player, currentTurn, isInTransition)
                  )}
                </div>`
        ),
      }}
    ></div>
  `;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);


/***/ }),

/***/ "./src/PreGame.js":
/*!************************!*\
  !*** ./src/PreGame.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./src/component.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _fns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fns */ "./src/fns.js");
/* harmony import */ var _ships_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ships.json */ "./src/ships.json");
/* harmony import */ var _difficulty_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./difficulty.json */ "./src/difficulty.json");
/* harmony import */ var _components_Board__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/Board */ "./src/components/Board.js");
/* harmony import */ var _modules_Gameboard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/Gameboard */ "./src/modules/Gameboard.js");
/* harmony import */ var _modules_Ship__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/Ship */ "./src/modules/Ship.js");









const PreGame = (mode, setPlayerBoard, finish) => {
  const { size, ships } = _difficulty_json__WEBPACK_IMPORTED_MODULE_4__[mode];
  let thisGameBoard = (0,_modules_Gameboard__WEBPACK_IMPORTED_MODULE_6__.default)(size);

  const currentBoard = (0,_component__WEBPACK_IMPORTED_MODULE_0__.createState)(thisGameBoard);
  const allShips = (0,_component__WEBPACK_IMPORTED_MODULE_0__.createState)({});
  const currentShip = (0,_component__WEBPACK_IMPORTED_MODULE_0__.createState)({});

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
    const shipLength = _ships_json__WEBPACK_IMPORTED_MODULE_3__[currentShip.value.type].length;
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
        (state) => `cell ${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.determineCellClass)(state.get(row, col), true)}`
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
      const { name, length } = _ships_json__WEBPACK_IMPORTED_MODULE_3__[currentShip.value.type];
      const ship = new _modules_Ship__WEBPACK_IMPORTED_MODULE_7__.default(name, length);
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
    thisGameBoard = (0,_fns__WEBPACK_IMPORTED_MODULE_2__.default)(size, ships);
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

  return _component__WEBPACK_IMPORTED_MODULE_0__.html`<button ${{ onClick: randomize }}>Randomize</button>
    <button ${{ onClick: reset }}>Reset</button>
    <button ${{ onClick: finishPlacing }}>Finish placing</button>
    <h2>Place your ships (hold ctrl key to switch direction)</h2>
    <div>
      ${ships.map(
        (ship) =>
          _component__WEBPACK_IMPORTED_MODULE_0__.html`<button
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
      ${(0,_components_Board__WEBPACK_IMPORTED_MODULE_5__.default)({
        size,
        additionalCellProps,
        clickHandler: placeShip,
        board: currentBoard.value.getBoard(),
      })}
    </div> `;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PreGame);


/***/ }),

/***/ "./src/component.js":
/*!**************************!*\
  !*** ./src/component.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "html": () => (/* binding */ html),
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "createElementFromString": () => (/* binding */ createElementFromString),
/* harmony export */   "createState": () => (/* binding */ createState)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");


const stateStore = new Map();
const defaultProps = ['textContent', 'innerHTML', 'outerHTML', 'innerText'];
const booleanAttributes = [
  'checked',
  'selected',
  'disabled',
  'readonly',
  'multiple',
  'ismap',
  'noresize',
  'reversed',
  'autocomplete',
];

const isObject = (val) => typeof val === 'object';
const isArray = (val) => Array.isArray(val);
const isTemplate = (val) => val._type && val._type === 'template';
const isEventListeners = (val) =>
  isObject(val) && Object.keys(val).every((key) => key.startsWith('on'));
const isState = (val) =>
  isObject(val) && Object.keys(val).every((key) => key.startsWith('$'));
const isBooleanAttribute = (val) => booleanAttributes.includes(val);
const isStyleAttribute = (str) => str.startsWith('$style:');
const isDefaultProps = (val) =>
  isObject(val) && Object.keys(val).every((key) => defaultProps.includes(key));

const _handlerTypeReducer = (str) => {
  let type;
  if (defaultProps.includes(str.replace('$', ''))) {
    type = 'prop';
  } else if (isStyleAttribute(str)) {
    type = 'style';
  } else if (str.replace('$', '') === 'content') {
    type = 'content';
  } else {
    type = 'attr';
  }

  return type;
};

const _handlerValueReducer = (type, obj) => {
  switch (type) {
    case 'listener':
      return {
        name: obj[0].replace('on', '').toLowerCase(),
        value: obj[1],
      };
    case 'prop':
      return {
        name: obj[0].replace('$', ''),
        value: obj[1],
      };
    case 'attr':
      return {
        name: obj[0].replace('$', ''),
        value: obj[1],
      };
    case 'style':
      return {
        name: obj[0],
        value: obj[1],
      };
    case 'text':
      return {
        value: obj[1],
      };
    case 'content':
      return {
        value: obj[1],
      };
    default:
      throw new Error('Invalid handler type.');
  }
};

const _generateHandler = (type, obj) => {
  const arr = [];
  const id = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.uuid)();
  const attrName = `data-${type}-id`;
  const dataAttr = `${attrName}="${id}"`;

  Object.entries(obj).forEach((item) => {
    arr.push({
      type,
      query: `[${dataAttr}]`,
      data: _handlerValueReducer(type, item),
      attr: attrName,
      remove: false,
    });
  });

  arr[arr.length - 1].remove = true;

  return [arr, dataAttr];
};

const _bindState = (state) => {
  const id = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.uuid)();
  const proxyId = `data-proxy-id="${id}"`;
  const handlers = {};

  Object.entries(state).forEach(([key, handler]) => {
    const bindedElements = stateStore.get(handler._id);
    const existingHandlers = bindedElements.get(id) || [];

    const finalValue = handler.trap
      ? handler.trap.call(null, handler.value)
      : handler.value;
    const target = key.replace('$style:', '').replace('$', '');
    const type = _handlerTypeReducer(key);

    // Store the new handlers
    bindedElements.set(id, [
      ...existingHandlers,
      {
        type,
        target,
        propName: handler.propName,
        trap: handler.trap,
      },
    ]);

    if (!handlers[type]) {
      handlers[type] = {};
    }

    handlers[type][target] = finalValue;
  });

  const [allHandlers, str] = Object.entries(handlers)
    .map(([type, obj]) => _generateHandler(type, obj))
    .reduce(
      (prev, current) => [
        [...prev[0], ...current[0]],
        [...prev[1], current[1]],
      ],
      [[], []]
    );

  return [allHandlers, `${proxyId} ${str.join(' ')}`];
};

// return value is [str, array]
const _parser = (expr, handlers = []) => {
  // if expr is array, map and parse each item
  // items must be all strings after parsing
  if (isArray(expr)) {
    const [strArray, handlersArray] = expr
      .map((item) => _parser(item, handlers))
      .reduce(
        (prev, current) => [
          [...prev[0], current[0]],
          [...prev[1], ...current[1]],
        ],
        [[], []]
      );

    return [strArray.join(''), handlersArray];
  }

  // if template
  // add its handlers to ours
  // then return the string
  if (isTemplate(expr)) {
    return [expr[0], [...handlers, ...expr[1]]];
  }

  // if Object and that object contains only keys which name is an event
  // generate a temporary id and replace the object with it
  // then add the event listeners to our handlers
  if (isEventListeners(expr)) {
    const [eventHandlers, id] = _generateHandler('listener', expr);

    return [id, [...handlers, ...eventHandlers]];
  }

  if (isState(expr)) {
    const [propHandlers, id] = _bindState(expr);
    return [id, [...handlers, ...propHandlers]];
  }

  if (isDefaultProps(expr)) {
    const [defaultPropHandlers, id] = _generateHandler('prop', expr);
    return [id, [...handlers, ...defaultPropHandlers]];
  }

  // if none of our accepted types, assume it is string
  // then just return it
  return [`${expr}`, []];
};

const _createTemplate = (arr) => {
  const arrayLikeObj = {};

  arr.forEach((i, idx) => {
    arrayLikeObj[idx] = arr[idx];
  });

  arrayLikeObj.length = arr.length;
  arrayLikeObj._type = 'template';

  Object.defineProperty(arrayLikeObj, '_type', {
    enumerable: false,
  });

  return arrayLikeObj;
};

const _replacePlaceholders = (str) => {
  let newString = str;
  let match = newString.match(/{%\s*(.*)\s*%}/);
  const handlers = [];

  while (match) {
    const [textHandlers, id] = _generateHandler('text', {
      text: match[1].trim(),
    });

    handlers.push(...textHandlers);

    newString = newString.replace(match[0], `<i ${id}></i>`);

    match = newString.slice(match.index).match(/{%\s*(.*)\s*%}/);
  }

  return [newString, handlers];
};

const parseString = (strings, ...exprs) => {
  const [evaluatedExprs, handlers] = exprs
    .map((expr) => _parser(expr))
    .reduce(
      (prev, current) => [
        [...prev[0], current[0]],
        [...prev[1], ...current[1]],
      ],
      [[], []]
    );

  const htmlString = evaluatedExprs.reduce(
    (fullString, expr, i) => `${fullString}${expr}${strings[i + 1]}`,
    strings[0]
  );

  const [sanitizedString, textHandlers] = _replacePlaceholders(htmlString);
  handlers.push(...textHandlers);

  return _createTemplate([sanitizedString, handlers]);
};

const html = (strings, ...exprs) => parseString(strings, ...exprs);

const _modifyElement = ({ element, type, data, context = document }) => {
  const el = context.querySelector(element);

  switch (type) {
    case 'prop':
      el[data.name] = data.value;
      break;
    case 'attr':
      if (isBooleanAttribute(data.name)) {
        if (data.value) {
          el.setAttribute(data.name, '');
        } else {
          el.removeAttribute(data.name);
        }
      } else {
        el.setAttribute(data.name, data.value);
      }

      break;
    case 'listener':
      el.addEventListener(data.name, data.value);
      break;
    case 'text':
      el.replaceWith(document.createTextNode(data.value));
      break;
    case 'style':
      el.style[data.name] = data.value;
      break;
    case 'content':
      [...el.children].map((child) => child.remove());

      el.appendChild(
        data.value instanceof HTMLElement
          ? data.value
          : render(html`${data.value}`)
      );

      break;
    default:
      throw new Error('Invalid type.');
  }
};

const createElementFromString = (str, handlers = []) => {
  const createdElement = document.createRange().createContextualFragment(str);

  handlers.forEach((handler) => {
    const el = createdElement.querySelector(handler.query);

    if (!el) return;

    _modifyElement({
      element: handler.query,
      type: handler.type,
      data: handler.data,
      context: createdElement,
    });

    if (handler.remove) {
      el.removeAttribute(handler.attr);
    }
  });

  return createdElement;
};

const render = (template) => createElementFromString(...Array.from(template));

const _setHandler = (stateId) => ({
  set: (target, prop, value, receiver) => {
    const bindedElements = stateStore.get(stateId);

    bindedElements.forEach((handlers, id) => {
      const query = `[data-proxy-id="${id}"]`;
      const el = document.querySelector(query);

      if (el) {
        handlers.forEach((handler) => {
          if (prop !== handler.propName) return;

          const finalValue = handler.trap
            ? handler.trap.call(null, value)
            : value;

          _modifyElement({
            element: query,
            type: handler.type,
            data: { name: handler.target, value: finalValue },
          });
        });
      } else {
        // delete handler when the target is unreachable (most likely deleted)
        bindedElements.delete(id);
      }
    });

    return Reflect.set(target, prop, value, receiver);
  },
});

const createState = (initValue = null) => {
  const _id = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.uuid)();
  // Map contains id keys
  // id keys are proxy ids of elements binded to the state
  stateStore.set(_id, new Map());

  const state = {
    bindValue: (trap = null) => ({
      propName: 'value',
      trap,
      _id,
      value: state.value,
    }),
    bind: (propName = 'value', trap = null) => ({
      propName,
      trap,
      _id,
      value: propName === 'value' ? state.value : state.value[propName],
    }),
  };

  if (isObject(initValue)) {
    state.value = new Proxy(initValue, _setHandler(_id));
  } else {
    state.value = initValue;
  }

  return new Proxy(state, _setHandler(_id));
};




/***/ }),

/***/ "./src/components/Board.js":
/*!*********************************!*\
  !*** ./src/components/Board.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "./src/component.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.js");



// TODO: make this a custom component if needed
const Board = ({
  number,
  size,
  board,
  clickHandler,
  additionalCellProps,
  additionalBoardProps = null,
}) =>
  _component__WEBPACK_IMPORTED_MODULE_0__.html`<div
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
            _component__WEBPACK_IMPORTED_MODULE_0__.html`<div
              data-pos="${i}-${j}"
              class="cell ${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.determineCellClass)(cell)}"
              ${additionalCellProps.call(null, [i, j])}
            ></div>`
        )
      )
      .flat()}
  </div>`;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Board);


/***/ }),

/***/ "./src/components/PlayerBoard.js":
/*!***************************************!*\
  !*** ./src/components/PlayerBoard.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "./src/component.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../event */ "./src/event.js");
/* harmony import */ var _Board__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Board */ "./src/components/Board.js");





const PlayerBoard = (player, currentTurn, inTransition) => {
  const { type, number, gameboard } = player;
  const thisBoard = (0,_component__WEBPACK_IMPORTED_MODULE_0__.createState)(gameboard.getBoard());

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
        _event__WEBPACK_IMPORTED_MODULE_2__.default.emit('player defeated', number);
      }

      _event__WEBPACK_IMPORTED_MODULE_2__.default.emit('attack received', number);
    } catch (error) {
      console.warn(error);
    }
  };

  const additionalCellProps = ([x, y]) => ({
    $class: thisBoard.bindValue(
      (board) => `cell ${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.determineCellClass)(board[x][y], type === 'human')}`
    ),
  });

  const additionalBoardProps = {
    '$style:border': currentTurn.bindValue((turn) =>
      turn === number ? '3px solid rgb(206, 18, 18)' : '3px solid black'
    ),
  };

  return (0,_Board__WEBPACK_IMPORTED_MODULE_3__.default)({
    number,
    clickHandler,
    additionalCellProps,
    additionalBoardProps,
    board: thisBoard.value,
    size: gameboard.size,
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PlayerBoard);


/***/ }),

/***/ "./src/difficulty.json":
/*!*****************************!*\
  !*** ./src/difficulty.json ***!
  \*****************************/
/***/ ((module) => {

module.exports = JSON.parse('{"test":{"size":5,"ships":[{"name":"battleship","number":1}]},"normal":{"size":10,"ships":[{"name":"battleship","number":1},{"name":"destroyer","number":1},{"name":"submarine","number":1},{"name":"patrolBoat","number":3},{"name":"boat","number":3}]},"medium":{"size":12,"ships":[{"name":"carrier","number":1},{"name":"battleship","number":1},{"name":"destroyer","number":2},{"name":"submarine","number":1},{"name":"patrolBoat","number":3},{"name":"boat","number":3}]},"hard":{"size":16,"ships":[{"name":"carrier","number":1},{"name":"battleship","number":1},{"name":"destroyer","number":2},{"name":"submarine","number":2},{"name":"patrolBoat","number":4},{"name":"boat","number":4}]}}');

/***/ }),

/***/ "./src/enemy.js":
/*!**********************!*\
  !*** ./src/enemy.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/Player */ "./src/modules/Player.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event */ "./src/event.js");




const createAI = (playerNumber, numberOfPlayers, boardSize) => {
  const allMoves = [...new Array(numberOfPlayers).fill(null)].map((arr, i) => ({
    number: i + 1,
    pastMoves: [],
  }));
  const defeatedPlayers = [];

  const _choosePlayerToAttack = () => {
    let playerToAttack = '';

    do {
      playerToAttack = Math.floor(Math.random() * numberOfPlayers) + 1;
    } while (
      defeatedPlayers.includes(playerToAttack) ||
      playerToAttack === playerNumber
    );

    return playerToAttack;
  };

  const _attack = (currentTurn) => {
    if (currentTurn !== playerNumber) return;

    const playerToAttack = _choosePlayerToAttack();
    const { pastMoves } = allMoves.find(
      (target) => target.number === playerToAttack
    );
    const move = (0,_modules_Player__WEBPACK_IMPORTED_MODULE_0__.doRandomAttack)(boardSize, pastMoves).join('-');
    const cell = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.default)(
      `[data-board-num="${playerToAttack}"] .cell[data-pos="${move}"]`
    );

    pastMoves.push(move);

    if (['cell hit', 'cell missed'].includes(cell.className)) {
      _attack(currentTurn);
      return;
    }

    cell.click();
  };

  const _addDefeatedPlayer = (player) => defeatedPlayers.push(player);

  const init = () => {
    _event__WEBPACK_IMPORTED_MODULE_2__.default.on('next turn', _attack);
    _event__WEBPACK_IMPORTED_MODULE_2__.default.on('player defeated', _addDefeatedPlayer);
  };

  const destroy = () => {
    _event__WEBPACK_IMPORTED_MODULE_2__.default.off('next turn', _attack);
    _event__WEBPACK_IMPORTED_MODULE_2__.default.off('player defeated', _addDefeatedPlayer);
  };

  return {
    init,
    destroy,
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createAI);


/***/ }),

/***/ "./src/event.js":
/*!**********************!*\
  !*** ./src/event.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, fn, options) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push({ fn, options });
  }

  off(eventName, fn) {
    const handlers = this.events
      .get(eventName)
      .filter((handler) => handler.fn !== fn);

    this.events.set(eventName, handlers);
  }

  clear() {
    this.events.clear();
  }

  delete(eventName) {
    this.events.delete(eventName);
  }

  emit(eventName, payload = null) {
    const handlers = this.events.get(eventName) || [];

    handlers.forEach((handler) => {
      handler.fn.call(null, payload);

      if (handler.options && handler.options.once) {
        this.off(eventName, handler.fn);
      }
    });
  }
}

const event = new EventEmitter();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (event);


/***/ }),

/***/ "./src/fns.js":
/*!********************!*\
  !*** ./src/fns.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_Ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/Ship */ "./src/modules/Ship.js");
/* harmony import */ var _modules_Gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/Gameboard */ "./src/modules/Gameboard.js");
/* harmony import */ var _modules_Player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/Player */ "./src/modules/Player.js");
/* harmony import */ var _ships_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ships.json */ "./src/ships.json");





const randomizeBoard = (size, ships) => {
  const currentBoard = (0,_modules_Gameboard__WEBPACK_IMPORTED_MODULE_1__.default)(size);

  const allShips = [...ships];
  let currentShip = null;

  while (allShips.length) {
    currentShip = allShips.shift();

    let currentCount = currentShip.number;
    while (currentCount) {
      const move = (0,_modules_Player__WEBPACK_IMPORTED_MODULE_2__.doRandomPlacing)(size);
      const shipDetails = _ships_json__WEBPACK_IMPORTED_MODULE_3__[currentShip.name];
      const ship = new _modules_Ship__WEBPACK_IMPORTED_MODULE_0__.default(shipDetails.name, shipDetails.length);

      try {
        currentBoard.placeShip({ ship, ...move });
        currentCount -= 1;
      } catch (error) {
        // console.warn(error.toString());
        continue;
      }
    }
  }

  return currentBoard;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (randomizeBoard);


/***/ }),

/***/ "./src/modules/Gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/Gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.js");


const tryCatchForLoop = (limit, fn, start = 0) => {
  for (let i = start; i < limit; i++) {
    try {
      fn.call(null, i);
    } catch (error) {
      continue;
    }
  }
};

const Gameboard = (size) => {
  const state = {
    ships: new Map(),
  };

  let board = [...new Array(size).fill([])].map(() => [
    ...new Array(size).fill(null),
  ]);

  const reset = () => {
    board = [...new Array(size).fill([])].map(() => [
      ...new Array(size).fill(null),
    ]);
    state.ships.clear();
  };

  const get = (row, col) => {
    if (row < 0 || row > size - 1 || col < 0 || col > size - 1) {
      throw new Error('Coordinates is off bounds');
    }

    return board[row][col];
  };

  const getBoard = () => [...board].map((row) => [...row]);

  const setBoard = (newBoard) => {
    board = newBoard;
  };

  const _markSurroundings = (pos, length, direction) => {
    const boardCopy = getBoard();
    const [rowLimit, columnLimit] =
      direction === 'y' ? [length + 2, 2] : [2, length + 2];

    const start = [pos.start.row - 1, pos.start.col - 1];
    const end = [pos.end.row + 1, pos.end.col + 1];

    tryCatchForLoop(columnLimit, (i) => {
      get(start[0], start[1] + i);
      boardCopy[start[0]][start[1] + i] = undefined;
    });
    tryCatchForLoop(columnLimit, (i) => {
      get(end[0], end[1] - i);
      boardCopy[end[0]][end[1] - i] = undefined;
    });
    tryCatchForLoop(rowLimit, (i) => {
      get(start[0] + i, start[1]);
      boardCopy[start[0] + i][start[1]] = undefined;
    });
    tryCatchForLoop(rowLimit, (i) => {
      get(end[0] - i, end[1]);
      boardCopy[end[0] - i][end[1]] = undefined;
    });

    setBoard(boardCopy);
  };

  const placeShip = ({ pos, ship, direction = 'x' }) => {
    const boardCopy = getBoard();

    const id = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.uuid)(4);
    state.ships.set(id, ship);

    const [rowIncrement, columnIncrement] = direction === 'y' ? [1, 0] : [0, 1];
    const [row, col] = pos;

    // Check if cell is already marked
    if (typeof get(row, col) === 'string') throw new Error('Cell occupied');

    let xi = 0;
    let yi = 0;

    for (let i = 0; i < ship.length; i++) {
      let marker;

      // Check if placing will result in ship
      // to go off the board
      try {
        marker = get(row + yi, col + xi);
      } catch (error) {
        throw new Error('Ship off-bounds');
      }

      // Throw error if placing will result in the ship
      // occupying another ship's surroundings
      if (marker === undefined) throw new Error('Cell within a ship territory');

      // Throw error when placing will result in overlap
      if (marker !== null) throw new Error('Ship overlaps');

      boardCopy[row + yi][col + xi] = `${ship.name}[${i}]_${id}`;

      xi += columnIncrement;
      yi += rowIncrement;
    }

    setBoard(boardCopy);

    const coordinates = {
      start: { row, col },
      end: {
        row: direction === 'y' ? row + ship.length - 1 : row,
        col: direction === 'x' ? col + ship.length - 1 : col,
      },
    };

    _markSurroundings(coordinates, ship.length, direction);

    return true;
  };

  const isGameOver = () =>
    board.every((row) =>
      row.every((cell) => ['HIT', 'MISS', null, undefined].includes(cell))
    );

  // v2
  // return Array.from(state.ships, ([key, value]) => ({
  //   key,
  //   value,
  // })).every(({ value: ship }) => ship.isSunk());

  const receiveAttack = (x, y) => {
    const boardCopy = getBoard();
    const marker = get(x, y);

    if (marker === 'HIT' || marker === 'MISS') {
      throw new Error(`Cell[${x}][${y}] was already selected`);
    }

    if (!marker) {
      boardCopy[x][y] = 'MISS';
      setBoard(boardCopy);

      return false;
    }

    const index = marker.match(/\[(\d)\]/)[1];
    const id = marker.split('_')[1];

    const ship = state.ships.get(id);
    ship.hit(index);

    boardCopy[x][y] = 'HIT';
    setBoard(boardCopy);

    return true;
  };

  return {
    size,
    get,
    getBoard,
    reset,
    placeShip,
    receiveAttack,
    isGameOver,
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);


/***/ }),

/***/ "./src/modules/Player.js":
/*!*******************************!*\
  !*** ./src/modules/Player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "makeMove": () => (/* binding */ makeMove),
/* harmony export */   "doRandomAttack": () => (/* binding */ doRandomAttack),
/* harmony export */   "doRandomPlacing": () => (/* binding */ doRandomPlacing)
/* harmony export */ });
const makeMove = (size) => [
  Math.floor(Math.random() * size),
  Math.floor(Math.random() * size),
];

const doRandomAttack = (size, pastMoves = []) => {
  let move;

  do {
    move = makeMove(size);
  } while (pastMoves.includes(move.join('-')));

  return move;
};

const doRandomPlacing = (size) => ({
  pos: makeMove(size),
  direction: Math.floor(Math.random() * 2) ? 'x' : 'y',
});




/***/ }),

/***/ "./src/modules/Ship.js":
/*!*****************************!*\
  !*** ./src/modules/Ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.body = new Array(length).fill('O');
  }

  hit(coord) {
    this.body[coord] = 'X';

    return this;
  }

  isSunk() {
    return this.body.every((part) => part === 'X');
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);


/***/ }),

/***/ "./src/ships.json":
/*!************************!*\
  !*** ./src/ships.json ***!
  \************************/
/***/ ((module) => {

module.exports = JSON.parse('{"carrier":{"name":"carrier","length":5},"battleship":{"name":"battleship","length":4},"destroyer":{"name":"destroyer","length":3},"submarine":{"name":"submarine","length":3},"patrolBoat":{"name":"patrol","length":2},"boat":{"name":"boat","length":1}}');

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "uuid": () => (/* binding */ uuid),
/* harmony export */   "determineCellClass": () => (/* binding */ determineCellClass)
/* harmony export */ });
const uuid = (length = 10) => Math.random().toString(36).substr(2, length);

const $ = (query) => {
  const [idFlag, allFlag, dataAttrFlag] = ['#', '--a', '@'];

  const isId = query.includes(idFlag);
  const isAll = query.includes(allFlag);
  const isDataAttr = query.includes(dataAttrFlag);
  const isDescendantSelector = query.includes(' ');

  if (isId && !isDescendantSelector) {
    return document.getElementById(query.replace(idFlag, ''));
  }
  if (isAll) {
    return document.querySelectorAll(query.replace(allFlag, ''));
  }
  if (isDataAttr && !isDescendantSelector) {
    return document.querySelector(`[data-${query.replace(dataAttrFlag, '')}]`);
  }

  return document.querySelector(query);
};

const determineCellClass = (cell, condition = false) => {
  switch (cell) {
    case 'HIT':
      return 'hit';
    case 'MISS':
      return 'missed';
    case 'SUNK':
      return 'sunk';
    case undefined:
      return 'occupied';
    case null:
      return '';
    default:
      return condition ? 'ship' : '';
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ($);



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./src/component.js");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App */ "./src/App.js");



document.body.appendChild((0,_component__WEBPACK_IMPORTED_MODULE_0__.render)((0,_App__WEBPACK_IMPORTED_MODULE_1__.default)()));

})();

/******/ })()
;
//# sourceMappingURL=main.js.map