import React from 'react'
import { toggleModal } from './Nav'

function saveFile () {
  console.log('need to save in DB')
}

function openFile () {
  console.log('need to get files from DB')
}

function Modal (modal) {
  let activeClass = null
  let button = <button>Save</button>
  if (modal) activeClass = 'active'
  if (modal === 'Save File') button = <button onClick={saveFile}>Save</button>
  if (modal === 'Open File') button = <button onClick={openFile}>Open</button>

  return (
    <div className={activeClass}>
      <div className='modal'>
        <div className='title'>{modal}
          <div className='btns-wrapper'>
            <button onClick={toggleModal.bind(null, false)} ><i className='fa fa-times' /></button>
          </div>
        </div>
        <div className='modal-body' />
        <div className='modal-footer'>
          <input />
          <button onClick={toggleModal.bind(null, false)}>Cancel</button>
          {button}
        </div>
      </div>
      <div className='modal-back' />
    </div>
  )
}

export default Modal
