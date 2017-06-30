function createNewBoard () {
  let board = []
  for (let i = 0; i < row; i++) {
    let row = []
    for (let j = 0; j < piece; j++) {
      row.push(false)
    }
    board.push(row)
  }
  return board
}

const row = 30
const piece = 50
let board = createNewBoard()

let appState = {
  row: row,
  piece: piece,
  board: board
}

// export default appState
