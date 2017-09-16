import React from 'react'
import mori from 'mori'

function clickColor (evt) {
  let colorSelected = evt.target.className
  updateColor(colorSelected)
}

function updateColor (color) {
  const currentState = window.CURRENT_STATE
  const newState = mori.assoc(currentState, 'color', color)
  window.NEXT_STATE = newState
}

function Tools (colorSelected) {
  let colors = ['black', 'white', 'darkgrey', 'grey', 'darkgreen', 'green', 'red', 'orange', 'blue', 'cyan', 'purple', 'yellow']
  let palet = colors.map(function (color, i) {
    return <div key={i} onClick={clickColor} className={color} />
  })
  return (
    <div className='tools'>
      <div onClick={updateColor.bind(null, 'black')} className='pencil'><i className='fa fa-pencil' /></div>
      <div onClick={updateColor.bind(null, false)} className='erase'><i className='fa fa-eraser' /></div>
      {palet}
      <span className='main-color'>
        <div className={colorSelected} />
      </span>
    </div>
  )
}

export default Tools
