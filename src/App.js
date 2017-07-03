import './App.css'
import React from 'react'
import mori from 'mori'
import { MoriComponent } from './MoriComponent'
import Header from './Header'
import { Nav, goBack, goForward } from './Nav'
import Tools from './Tools'
import Square from './Square'
import Modal from './Modal'

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
  const color = mori.get(props.imdata, 'color')
  const modal = mori.get(props.imdata, 'modal')
  const title = mori.get(props.imdata, 'title')
  const modalInput = mori.get(props.imdata, 'modalInput')
  const dbFiles = mori.get(props.imdata, 'dbFiles')

  let boardClass = `board v${view}`

  let rows = []
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    let rowVec = mori.get(board, rowIdx)
    let rowData = mori.hashMap('rows', rowVec, 'rowIdx', rowIdx)

    rows.push(<Row imdata={rowData} key={rowIdx} />)
  }

  return (
    <div>
      <div tabIndex='0' onKeyDown={keyDownHandler} onKeyUp={keyUpHandler} className='paint'>
        {Header(title)}
        {Nav()}
        <div className='main-wrapper'>
          {Tools(color)}
          <div className={boardClass}>{rows}</div>
        </div>
      </div>
      <div className='bar'>
        <a className='start-btn'>Start</a>
      </div>
      {Modal(modal, modalInput, dbFiles)}
    </div>
  )
}

export default App
