import React from 'react'
import { toggleModal } from './Nav'

function saveFile () {
  console.log('need to save in DB')
}

function openFile () {
  console.log('need to get files from DB')
}

function changeTitle () {

}

function Modal (modal, title, dbFiles) {
  let activeClass = null
  let modalData = 'Loading ...'
  let button = <button>Save</button>
  let titlesArr = []

  if (modal) activeClass = 'active'
  if (modal === 'Save File') button = <button onClick={saveFile}>Save</button>
  if (modal === 'Open File') {
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
          <input value={title} onChange={changeTitle} />
          <button onClick={toggleModal.bind(null, false)}>Cancel</button>
          {button}
        </div>
      </div>
      <div className='modal-back' />
    </div>
  )
}

export default Modal
