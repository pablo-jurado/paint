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
  let newState = window.CURRENT_STATE
  // gets new name from modal input
  let inputValue = mori.getIn(newState, ['modal', 'input'])
  // updates title with new input value
  newState = mori.assoc(newState, 'title', inputValue)
  // TODO: need to save file to DB

  // this will close the modal and erase input and selected values
  newState = mori.assocIn(newState, ['modal', 'input'], '')
  newState = mori.assocIn(newState, ['modal', 'selectedFile'], null)
  newState = mori.assocIn(newState, ['modal', 'modalType'], false)

  window.NEXT_STATE = newState
}

function closeModal () {
  // this close the modal
  let newState = mori.assocIn(window.CURRENT_STATE, ['modal', 'modalType'], false)
  newState = mori.assocIn(newState, ['modal', 'input'], '')
  newState = mori.assocIn(newState, ['modal', 'selectedFile'], null)
  window.NEXT_STATE = newState
}

function Modal (modalData) {
  let activeClass = null
  let modalContent = null

  const modalInput = mori.get(modalData, 'input')
  const dbFiles = mori.get(modalData, 'dbFiles')
  const modal = mori.get(modalData, 'modalType')
  const selectedFile = mori.get(modalData, 'selectedFile')

  if (modal) activeClass = 'active'
  if (modal === 'Save File') modalContent = modalSaveFile(modalInput)
  if (modal === 'Open File') modalContent = modalOpenFile(dbFiles, selectedFile)

  return (
    <div className={activeClass}>
      <div className='modal'>
        <div className='title'>{modal}
          <div className='btns-wrapper'>
            <button onClick={closeModal} ><i className='fa fa-times' /></button>
          </div>
        </div>
        {modalContent}
      </div>
      <div className='modal-back' />
    </div>
  )
}

function selectFile (e) {
  let fileId = e.target.id
  window.NEXT_STATE = mori.assocIn(window.CURRENT_STATE, ['modal', 'selectedFile'], fileId)
}

function modalOpenFile (dbFiles, selectedFile) {
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
      if (selectedFile == i) {
        classVal = 'selected'
      }
      return <li key={i} id={i} className={classVal}>{item}</li>
    })
  }
  return (
    <div>
      <ul onClick={selectFile} className='modal-body'>{modalData}</ul>
      <div className='modal-footer'>
        <button onClick={closeModal}>Cancel</button>
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
        <button onClick={closeModal}>Cancel</button>
        <button onClick={saveFile}>Save</button>
      </div>
    </div>
  )
}

export default Modal
