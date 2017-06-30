import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Map, List } from 'immutable'

// ---------------------------------------------------------
// App State
// ---------------------------------------------------------
const row = 50
const piece = 50
let board = createNewBoard()

function createNewBoard () {
  let board = []
  for (let i = 0; i < row; i++) {
    let row = []
    for (let j = 0; j < piece; j++) {
      row.push(false)
    }
    board.push(List(row))
  }
  return List(board)
}

window.NEXT_STATE = Map({
  row: row,
  piece: piece,
  board: board
})

window.CURRENT_STATE = Map({
  row: null,
  piece: null,
  board: null
})

let renderCount = 0

// ---------------------------------------------------------
// Render Loop
// ---------------------------------------------------------

const rootEl = document.getElementById('root')

function render () {
  // Only trigger a render if CURRENT_STATE and NEXT_STATE are different.
  // checking deep equality of a persistent data structure is a fast and
  // cheap operation, even for large data structures
  if (!window.CURRENT_STATE.equals(window.NEXT_STATE)) {
    // next state is now our current state
    window.CURRENT_STATE = window.NEXT_STATE

    // TODO: add this new state to your history vector here...

    ReactDOM.render(App(window.CURRENT_STATE), rootEl)

    renderCount = renderCount + 1
    // console.log('Render #' + renderCount)
  }

  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)
