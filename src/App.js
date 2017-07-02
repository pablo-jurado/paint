import './App.css'
import React, { Component } from 'react'
import mori from 'mori'

let mouseDown = null
let colorSelected = 'black'

const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

// a MoriComponent receives a JavaScript Object with one key: imdata
// imdata should be a mori structure that supports mori.equals() comparisons
class MoriComponent extends Component {
  // only update the component if the mori data structure is not equal
  shouldComponentUpdate (nextProps, _nextState) {
    return !mori.equals(this.props.imdata, nextProps.imdata)
  }
}

function updateState (rowIdx, colIdx) {
  const currentState = window.CURRENT_STATE
  const newState = mori.updateIn(currentState, ['board', rowIdx, colIdx], getColor)
  window.NEXT_STATE = newState
}

function updateColor () {
  const currentState = window.CURRENT_STATE
  const newState = mori.updateIn(currentState, ['color'], getColor)
  window.NEXT_STATE = newState
}

function getColor () {
  return colorSelected
}

function handleClick (rowIdx, colIdx) {
  updateState(rowIdx, colIdx)
}

function handleOver (rowIdx, colIdx) {
  if (mouseDown) {
    updateState(rowIdx, colIdx)
  }
}

function down () {
  mouseDown = true
  saveHistory()
}

function up () {
  mouseDown = false
}

function clickColor (evt) {
  colorSelected = evt.target.className
  updateColor()
}

function pencil () {
  colorSelected = 'black'
}

function eraser () {
  colorSelected = false
}

function clear () {
  window.NEXT_STATE = mori.hashMap('board', window.EMPTY_BOARD)
}

function saveHistory () {
  // save current state in history
  window.STATE_HISTORY.push(window.CURRENT_STATE)
  let histoNum = window.STATE_HISTORY.length
  const newState = mori.assoc(window.CURRENT_STATE, 'history', histoNum)
  window.NEXT_STATE = newState
}

function goBack () {
  const historyState = mori.updateIn(window.CURRENT_STATE, ['history'], mori.dec)
  const historyNum = mori.get(historyState, 'history')

  window.NEXT_STATE = window.STATE_HISTORY[historyNum]
}

function goForward () {
  const historyState = mori.updateIn(window.CURRENT_STATE, ['history'], mori.inc)
  const historyNum = mori.get(historyState, 'history')

  log('historyNum', historyNum)
  log('length', window.STATE_HISTORY.length)

  window.NEXT_STATE = window.STATE_HISTORY[historyNum]
}

class Square extends MoriComponent {
  render () {
    const rowIdx = mori.get(this.props.imdata, 'rowIdx')
    const colIdx = mori.get(this.props.imdata, 'colIdx')
    const color = mori.get(this.props.imdata, 'color')

    let className = 'square '
    if (color) className += color

    return (
      <div className={className}
        onMouseUp={up}
        onMouseDown={down}
        onClick={handleClick.bind(null, rowIdx, colIdx)}
        onMouseOver={handleOver.bind(null, rowIdx, colIdx)}
      />
    )
  }
}

class Row extends MoriComponent {
  render () {
    const rowVec = mori.get(this.props.imdata, 'rows')
    const numCols = mori.count(rowVec)
    const rowIdx = mori.get(this.props.imdata, 'rowIdx')
    let squares = []
    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      const currentState = window.CURRENT_STATE
      const board = mori.get(currentState, 'board')
      const row = mori.get(board, rowIdx)
      const color = mori.get(row, colIdx)

      let squareData = mori.hashMap('rowIdx', rowIdx, 'colIdx', colIdx, 'color', color)

      squares.push(<Square imdata={squareData} key={colIdx} />)
    }

    return (
      <div className='row'>{squares}</div>
    )
  }
}

function App (props) {
  const board = mori.get(props.imdata, 'board')
  const numRows = mori.count(board)

  let rows = []
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    let rowVec = mori.get(board, rowIdx)
    let rowData = mori.hashMap('rows', rowVec, 'rowIdx', rowIdx)

    rows.push(<Row imdata={rowData} key={rowIdx} />)
  }

  return (
    <div>
      <div className='paint'>
        {header()}
        {nav()}
        <div className='main-wrapper'>
          {Tools()}
          <div className='board'>{rows}</div>
        </div>
        <br />
        <button onClick={goBack}>go back</button>
        <button onClick={goForward}>go forward</button>

      </div>
      <div className='bar'>
        <a className='start-btn'>Start</a>
      </div>
    </div>
  )
}

function Tools () {
  let colors = ['black', 'white', 'darkgrey', 'grey', 'darkgreen', 'green', 'red', 'orange', 'blue', 'cyan', 'purple', 'yellow']
  let palet = colors.map(function (color, i) {
    return <div key={i} onClick={clickColor} className={color} />
  })
  return (
    <div className='tools'>
      <div onClick={pencil} className='pencil'><i className='fa fa-pencil' /></div>
      <div onClick={eraser} className='erase'><i className='fa fa-eraser' /></div>
      {palet}
      <span className='main-color'>
        <div className={colorSelected} />
      </span>
    </div>
  )
}

function nav () {
  return (
    <nav>
      <ul>
        <li>
          <div className='dropdown'>
            <div>File</div>
            <div className='dropdown-menu'>
              <div onClick={clear}>New File</div>
              <div>Save</div>
            </div>
          </div>
        </li>
        <li>
          <div className='dropdown'>
            <div>Edit</div>
            <div className='dropdown-menu'>
              <div>Undo Ctrl+Z</div>
              <div>Redo Ctrl+Y</div>
            </div>
          </div>
        </li>
        <li>
          <div className='dropdown'>
            <div>View</div>
            <div className='dropdown-menu'>
              <div>100%</div>
              <div>50%</div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  )
}

function header () {
  return (
    <div className='title'>
      <i className='fa fa-paint-brush' /> Untitled - Paint
      <div className='btns-wrapper'>
        <button><i className='fa fa-window-minimize' /></button>
        <button><i className='fa fa-window-maximize' /></button>
        <button><i className='fa fa-times' /></button>
      </div>
    </div>
  )
}

export default App
