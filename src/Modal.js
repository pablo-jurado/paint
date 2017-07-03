import React from 'react'
import { toggleModal } from './Nav'
import mori from 'mori'

function openFile () {
  console.log('need to select and get files from DB')
}

function updateInput (e) {
  let newTitle = e.target.value
  window.NEXT_STATE = mori.assoc(window.CURRENT_STATE, 'modalInput', newTitle)
}

function saveFile () {
  // gets new name from modal input
  let newTitle = mori.get(window.CURRENT_STATE, 'modalInput')
  // updates title with newone
  window.NEXT_STATE = mori.assoc(window.CURRENT_STATE, 'title', newTitle)

  console.log(`todo: save current file ${newTitle} to db`)
}

function Modal (modal, modalInput, dbFiles) {
  let activeClass = null
  let modalData = ''
  let button = <button>Save</button>
  let titlesArr = []

  if (modal) activeClass = 'active'
  if (modal === 'Save File') button = <button onClick={saveFile}>Save</button>
  if (modal === 'Open File') {
    modalData = 'Loading ...'
    button = <button onClick={openFile}>Open</button>
    if (dbFiles) {
      for (var id in dbFiles) {
        if (dbFiles.hasOwnProperty(id)) {
          titlesArr.push(dbFiles[id]['title'])
        }
      }
      modalData = titlesArr.map(function (item, i) {
        return <li key={i}>{item}</li>
      })
    }
  }

  return (
    <div className={activeClass}>
      <div className='modal'>
        <div className='title'>{modal}
          <div className='btns-wrapper'>
            <button onClick={toggleModal.bind(null, false)} ><i className='fa fa-times' /></button>
          </div>
        </div>
        <ul className='modal-body'>{modalData}</ul>
        <div className='modal-footer'>
          <input value={modalInput} onChange={updateInput} />
          <button onClick={toggleModal.bind(null, false)}>Cancel</button>
          {button}
        </div>
      </div>
      <div className='modal-back' />
    </div>
  )
}

export default Modal
