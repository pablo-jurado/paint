import './App.css'
import React, { Component } from 'react'
import mori from 'mori'
import Header from './Header'
import { Nav, goBack, goForward } from './Nav'

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

function handleOver (rowIdx, colIdx) {
  if (mouseDown) {
    updateState(rowIdx, colIdx)
  }
}

function down (rowIdx, colIdx) {
  mouseDown = true
  updateState(rowIdx, colIdx)
}

function up () {
  saveHistory()
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



function saveHistory () {
  // increase history num
  const currentState = window.CURRENT_STATE
  const newStateHistory = mori.updateIn(currentState, ['history'], mori.inc)
  // saves in history
  window.HISTORY_STATE.push(newStateHistory)
  // updates state
  window.NEXT_STATE = newStateHistory
}



let keys = { control: false, z: false, y: false }

function keyDownHandler (event) {
  if (event.keyCode === 17) keys.control = true
  if (event.keyCode === 90) keys.z = true
  if (event.keyCode === 89) keys.y = true

  if (keys.control && keys.z) goBack()
  if (keys.control && keys.y) goForward()
}

function keyUpHandler (event) {
  if (event.keyCode === 17) keys.control = false
  if (event.keyCode === 90) keys.z = false
  if (event.keyCode === 89) keys.y = false
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
        onMouseDown={down.bind(null, rowIdx, colIdx)}
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
  const view = mori.get(props.imdata, 'view')

  let boardClass = 'board ' + 'v' + view

  let rows = []
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    let rowVec = mori.get(board, rowIdx)
    let rowData = mori.hashMap('rows', rowVec, 'rowIdx', rowIdx)

    rows.push(<Row imdata={rowData} key={rowIdx} />)
  }

  return (
    <div>
      <div tabIndex='0' onKeyDown={keyDownHandler} onKeyUp={keyUpHandler} className='paint'>
        {Header()}
        {Nav()}
        <div className='main-wrapper'>
          {Tools()}
          <div className={boardClass}>{rows}</div>
        </div>
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



export default App
