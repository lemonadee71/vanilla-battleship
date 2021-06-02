import Game from './Game';
import { html, createState } from './component';

const App = () => {
  const isGameStart = createState(false);
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

  return html`<div>
    <h1 class="title">Battleship</h1>
    <div
      ${{
        $content: isGameStart.bindValue((val) =>
          !val
            ? html`
                <label for="mode">Choose difficulty:</label>
                <select name="mode" ${{ onChange: changeMode }}>
                  <!-- <option value="test" selected>Test</option> -->
                  <option value="normal">Normal</option>
                  <option value="medium">Intermediate</option>
                  <option value="hard">Hard</option>
                </select>
                <label for="numberOfEnemies">Number of enemy computer:</label>
                <input
                  name="numberOfEnemies"
                  placeholder="Max: 9"
                  type="number"
                  min="1"
                  max="9"
                  style="width: 70px;"
                  ${{ onChange: changeNumberOfEnemies }}
                />
                <button ${{ onClick: startGame }}>Start game</button>
              `
            : html`${Game(mode, numberOfEnemies, restartGame)}`
        ),
      }}
    ></div>
  </div>`;
};

export default App;
