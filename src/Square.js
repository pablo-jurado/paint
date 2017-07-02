import React from 'react'
import mori from 'mori'
import { MoriComponent } from './MoriComponent'

let mouseDown = null

function updateState (rowIdx, colIdx) {
  const currentState = window.CURRENT_STATE
  const color = mori.get(currentState, 'color')
  const newState = mori.assocIn(currentState, ['board', rowIdx, colIdx], color)
  window.NEXT_STATE = newState
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

function saveHistory () {
  // increase history num
  const currentState = window.CURRENT_STATE
  const newStateHistory = mori.updateIn(currentState, ['history'], mori.inc)
  // saves in history
  window.HISTORY_STATE.push(newStateHistory)
  // updates state
  window.NEXT_STATE = newStateHistory
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

export default Square
