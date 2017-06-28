import React from 'react'
import './App.css'
import board from './Model'

let mouseDown = null

function Tools () {
  let colors = ['green', 'red', 'orange', 'blue', 'purple', 'cyan', 'orange', 'blue', 'purple', 'cyan']
  let palet = colors.map(function (color) {
    return <div className={color} />
  })
  return (
    <div className='tools'>
      <div className='pencil'><i className='fa fa-pencil' /></div>
      <div className='erase'><i className='fa fa-eraser' /></div>
      {palet}
    </div>
  )
}

function nav () {
  return (
    <nav>
      <ul>
        <li>
          <div className='btn-drop'>File</div>
          <div className='dropdown-content'>
            <div>Open</div>
            <div>Save</div>
            <div>Close</div>
          </div>
        </li>
        <li>Edit</li>
        <li>View</li>
      </ul>
    </nav>
  )
}

function header () {
  return (
    <div className='title'><i className='fa fa-paint-brush' /> Untitled - Paint
      <div className='btns-wrapper'>
        <button><i className='fa fa-window-minimize' /></button>
        <button><i className='fa fa-window-maximize' /></button>
        <button><i className='fa fa-times' /></button>
      </div>
    </div>
  )
}

function Square (row, rowIndex) {
  let classVal = ''
  let piece = row.map(function (item, i) {
    if (item) {
      classVal = 'square on'
    } else {
      classVal = 'square'
    }
    return <div onMouseUp={up}
      onMouseDown={down}
      onClick={handleClick.bind(null, rowIndex, i)}
      onMouseOver={handleOver.bind(null, rowIndex, i)}
      key={i} className={classVal} />
  })
  return piece
}

function handleClick (rowIndex, i) {
  board[rowIndex][i] = true
}

function handleOver (rowIndex, i) {
  if (mouseDown) {
    board[rowIndex][i] = true
  }
}

function down () {
  mouseDown = true
}

function up () {
  mouseDown = false
}

function clear () {
  // board = createNewBoard()
}

function App (board) {
  let col = board.map(function (item, index) {
    return <div key={index} className='row'>{Square(item, index)}</div>
  })
  return (
    <div>
      {header()}
      {nav()}
      <div className='main-wrapper'>
        {Tools()}
        <div className='board'>
          {col}
        </div>
      </div>
      <br />
      <button onClick={clear}>clear</button>
    </div>
  )
}

export default App
