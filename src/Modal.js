import React from 'react'
import mori from 'mori'
import firebase from './firebase'

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
  saveToDb(newState)
  // this will close the modal and erase input and selected values
  // newState = mori.assocIn(newState, ['modal', 'input'], '')
  // newState = mori.assocIn(newState, ['modal', 'selectedFile'], null)
  // newState = mori.assocIn(newState, ['modal', 'modalType'], false)

  var newModal = mori.hashMap('input', '',
                              'selectedFile', null,
                              'modalType', null)

  newState = mori.assoc(newState, 'modal', newModal)

  window.NEXT_STATE = newState
}

function closeModal () {
  let newState = mori.assocIn(window.CURRENT_STATE, ['modal', 'modalType'], false)
  newState = mori.assocIn(newState, ['modal', 'input'], '')
  newState = mori.assocIn(newState, ['modal', 'selectedFile'], null)
  window.NEXT_STATE = newState
}

function Modal (modalData) {
  let activeClass = null
  let modalContent = null

  const modalInput = mori.get(modalData, 'input')
  const modal = mori.get(modalData, 'modalType')
  const selectedFile = mori.get(modalData, 'selectedFile')

  if (modal) activeClass = 'active'
  if (modal === 'Save File') modalContent = modalSaveFile(modalInput)
  if (modal === 'Open File') modalContent = modalOpenFile(DB_FILES, selectedFile)

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

function openFile () {
  let newState = window.CURRENT_STATE
  const fileId = mori.getIn(newState, ['modal', 'selectedFile'])
  let dbFiles = mori.get(DB_FILES, fileId)
  dbFiles = mori.assocIn(dbFiles, ['modal', 'modalType'], false)
  window.NEXT_STATE = dbFiles
}

function modalOpenFile (dbFiles, selectedFile) {
  let modalData = 'Loading ...'
  let titles = []

  if (dbFiles) {
    mori.each(dbFiles, function (x) {
      const fileId = mori.first(x)
      const fileState = mori.nth(x, 1)

      const title = mori.get(fileState, 'title')
      let classVal = null
      if (selectedFile === fileId) classVal = 'selected'
      const element = <li key={fileId} id={fileId} className={classVal}>{title}</li>
      titles.push(element)
    })
    modalData = titles
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

// -----------------------------------------------------------------------------
// DB
// -----------------------------------------------------------------------------

let DB_FILES = null

function downloadFromDb () {
  // loading state
  console.log('loading db...')
  const dbRef = firebase.database().ref('files')
  dbRef.on('value', (snapshot) => {
    DB_FILES = mori.toClj(snapshot.val())
  }, function () {
    console.log('error')
  })
}

downloadFromDb()

function saveToDb (file) {
  console.log('saving to db')
  let jsFile = mori.toJs(file)
  const filesRef = firebase.database().ref('files')
  filesRef.push(jsFile)
}

export default Modal
