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

export { makeMove, doRandomAttack, doRandomPlacing };
