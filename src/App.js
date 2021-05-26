import Game from './Game';
import { html, createState } from './component';

const App = () => {
  const isGameStart = createState(false);
  let mode = 'test';

  const changeMode = (e) => {
    mode = e.target.value;
  };

  const startGame = () => {
    isGameStart.value = true;
  };

  const restartGame = () => {
    isGameStart.value = false;
    mode = 'test';
  };

  return html`<div>
    <h1 class="title">Battleship</h1>
    <div
      ${{
        $content: isGameStart.bindValue((val) =>
          !val
            ? html`
                <label for="mode">Choose difficulty:</label>
                <select name="mode" ${{ onChange: changeMode }}>
                  <option value="test" selected>Test</option>
                  <option value="normal">Normal</option>
                  <option value="medium">Intermediate</option>
                  <option value="hard">Hard</option>
                </select>
                <button ${{ onClick: startGame }}>Start game</button>
              `
            : html`${Game(mode, restartGame)}`
        ),
      }}
    ></div>
  </div>`;
};

export default App;
