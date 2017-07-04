import React from 'react'
import { toggleModal } from './Nav'
import mori from 'mori'

const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

function openFile () {
  console.log('need to select and get files from DB')
}

function updateInput (e) {
  let newTitle = e.target.value
  window.NEXT_STATE = mori.assocIn(window.CURRENT_STATE, ['modal', 'input'], newTitle)
}

function saveFile () {
  // gets new name from modal input
  let inputValue = mori.getIn(window.CURRENT_STATE, ['modal', 'input'])
  // updates title with new input value
  window.NEXT_STATE = mori.assoc(window.CURRENT_STATE, 'title', inputValue)

  console.log(`Todo: save current file ${inputValue} to db`)
}

function Modal (modalData) {
  let activeClass = null
  let modalContent = null

  const modalInput = mori.get(modalData, 'input')
  const dbFiles = mori.get(modalData, 'dbFiles')
  const modal = mori.get(modalData, 'modalType')

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

let fileSelected = null

function selectFile (e) {
  fileSelected = e.target.id
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
      let classVal = null
      if (fileSelected === i) classVal = 'selected'
      return <li key={i} id={i} className={classVal}>{item}</li>
    })
  }
  return (
    <div>
      <ul onClick={selectFile} className='modal-body'>{modalData}</ul>
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
