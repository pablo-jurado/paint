import './App.css'
import React, { Component } from 'react'
import mori from 'mori'

let mouseDown = null

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

function getColor (x) {
  return true
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
}

function up () {
  mouseDown = false
  // console.log('save history')
}

function clear () {
  window.NEXT_STATE = mori.hashMap('board', window.EMPTY_BOARD)
}

class Square extends MoriComponent {
  render () {
    const isOn = mori.get(this.props.imdata, 'isOn')
    const rowIdx = mori.get(this.props.imdata, 'rowIdx')
    const colIdx = mori.get(this.props.imdata, 'colIdx')

    let className = 'square'
    if (isOn) className += ' on'

    const key = 'square-' + rowIdx + '-' + colIdx

    return (
      <div key={key} className={className}
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
      let isOn = mori.get(rowVec, colIdx)
      let squareData = mori.hashMap('rowIdx', rowIdx, 'colIdx', colIdx, 'isOn', isOn)
      let key = 'square-' + rowIdx + '-' + colIdx

      squares.push(<Square imdata={squareData} key={key} />)
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
    let key = 'row-' + rowIdx

    rows.push(<Row imdata={rowData} key={key} />)
  }

  return (
    <div>
      {header()}
      {nav()}
      <div className='main-wrapper'>
        {Tools()}
        <div className='board'>{rows}</div>
      </div>
      <br />
      <button onClick={clear}>clear</button>
    </div>
  )
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
