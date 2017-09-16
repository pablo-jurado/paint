import React from 'react'

function Header (title) {
  return (
    <div className='title'>
      <i className='fa fa-paint-brush' /> {title} - Paint
      <div className='btns-wrapper'>
        <button><i className='fa fa-window-minimize' /></button>
        <button><i className='fa fa-window-maximize' /></button>
        <button><i className='fa fa-times' /></button>
      </div>
    </div>
  )
}
export default Header
