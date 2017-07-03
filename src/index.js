import ReactDOM from 'react-dom'
import App from './App'
import mori from 'mori'
import firebase from './firebase'

// -----------------------------------------------------------------------------
// Application State
// -----------------------------------------------------------------------------

const numRows = 80
const numCols = 150

function createEmptyBoard () {
  var board = []
  for (let i = 0; i < numRows; i++) {
    board[i] = []

    for (let j = 0; j < numCols; j++) {
      board[i][j] = false
    }
  }
  return board
}

window.EMPTY_BOARD = mori.toClj(createEmptyBoard())

const initialState = {
  board: window.EMPTY_BOARD,
  color: 'black',
  history: 0,
  dbFiles: null,
  view: 100,
  modal: null,
  modalInput: '',
  title: 'Untitled'
}

// CURRENT_STATE is always the current state of the application
window.CURRENT_STATE = null

// NEXT_STATE is the next state the application should be in
// Start it off with a PDS version of our initialState object.
window.NEXT_STATE = mori.toClj(initialState)

window.HISTORY_STATE = []
window.HISTORY_STATE.push(window.NEXT_STATE)

// -----------------------------------------------------------------------------
// DB
// -----------------------------------------------------------------------------

function downloadFormDb () {
  // loading state
  console.log('loading db...')
  const dbRef = firebase.database().ref('files')
  dbRef.on('value', (snapshot) => {
    // success
    let dbData = snapshot.val()
    window.NEXT_STATE = mori.assoc(window.CURRENT_STATE, 'dbFiles', dbData)
  }, function () {
    console.log('error')
  })
}

function saveToDb (file) {
  const filesRef = firebase.database().ref('files')
  filesRef.push(file)
}

downloadFormDb()

// -----------------------------------------------------------------------------
// Render Loop
// -----------------------------------------------------------------------------
let renderCount = 0

const rootEl = document.getElementById('root')

// constantly render on every requestAnimationFrame
function render () {
  // Only trigger a render if CURRENT_STATE and NEXT_STATE are different.
  // NOTE: checking deep equality of a persistent data structure is a fast and
  //       cheap operation, even for large data structures
  if (!mori.equals(window.CURRENT_STATE, window.NEXT_STATE)) {
    // do not perform the update if NEXT_STATE is not valid
    if (!isValidState(window.NEXT_STATE)) {
      console.warn('Oops! Tried to set an invalid NEXT_STATE')
      window.NEXT_STATE = window.CURRENT_STATE
    } else {
      // next state is now our current state
      window.CURRENT_STATE = window.NEXT_STATE

      ReactDOM.render(App({imdata: window.CURRENT_STATE}), rootEl)

      renderCount = renderCount + 1
      // console.log('Render #' + renderCount)
    }
  }

  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)

// this is a sanity-check function so you can ensure your state is valid
function isValidState (state) {
  return (
          mori.isMap(state) &&
          mori.isVector(mori.get(state, 'board'))
  )
}
