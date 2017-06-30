import React from 'react'
import './App.css'
import { Map, List } from 'immutable'


let mouseDown = null

function App (state) {
  let board = state.get('board')
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

function Square (rowMap, rowIndex) {
  let classVal = ''
  let piece = rowMap.map(function (item, i) {
    if (item) {
      classVal = 'square on'
    } else {
      classVal = 'square'
    }
    return <div key={i} onMouseUp={up}
      onMouseDown={down}
      onClick={handleClick.bind(null, rowIndex, i)}
      onMouseOver={handleOver.bind(null, rowIndex, i)}
      className={classVal} />
  })
  return piece
}

function handleClick (rowIdx, colIdx) {
  const state = window.CURRENT_STATE
  const board = state.get('board')
  const row = board.get(rowIdx)

  const newRow = row.set(colIdx, true)
  const newBoard = board.set(rowIdx, newRow)
  window.NEXT_STATE = window.NEXT_STATE.set('board', newBoard)
}

function handleOver (rowIndex, i) {
  if (mouseDown) {
    console.log('update', rowIndex, i)
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
  console.log('need to createNewBoard')
}

function Tools () {
  let colors = ['green', 'red', 'orange', 'blue', 'purple', 'cyan', 'orange', 'blue', 'purple', 'cyan']
  let palet = colors.map(function (color, i) {
    return <div key={i} className={color} />
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

export default App
