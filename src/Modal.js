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
  let inputValue = mori.get(window.CURRENT_STATE, 'modalInput')
  // updates title with new input value
  window.NEXT_STATE = mori.assoc(window.CURRENT_STATE, 'title', inputValue)

  console.log(`todo: save current file ${inputValue} to db`)
}

function Modal (modal, modalInput, dbFiles) {
  let activeClass = null
  let modalContent = null

  if (modal) activeClass = 'active'
  if (modal === 'Save File') modalContent = modalSaveFile(modalInput)
  if (modal === 'Open File') modalContent = modalOpenFile(dbFiles)

  return (
    <div className={activeClass}>
      <div className='modal'>
        <div className='title'>{modal}
          <div className='btns-wrapper'>
            <button onClick={toggleModal.bind(null, false)} ><i className='fa fa-times' /></button>
          </div>
        </div>
        {modalContent}
      </div>
      <div className='modal-back' />
    </div>
  )
}

function modalOpenFile (dbFiles) {
  let titlesArr = []
  let modalData = 'Loading ...'
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
  return (
    <div>
      <ul className='modal-body'>{modalData}</ul>
      <div className='modal-footer'>
        <button onClick={toggleModal.bind(null, false)}>Cancel</button>
        <button onClick={openFile}>Open</button>
      </div>
    </div>
  )
}

function modalSaveFile (modalInput) {
  return (
    <div>
      <div className='modal-footer'>
        <input value={modalInput} onChange={updateInput} />
        <button onClick={toggleModal.bind(null, false)}>Cancel</button>
        <button onClick={saveFile}>Save</button>
      </div>
    </div>
  )
}

export default Modal
