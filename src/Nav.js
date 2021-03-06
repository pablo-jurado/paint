import React from 'react'
import mori from 'mori'

function goBack () {
  const historyNum = mori.get(window.CURRENT_STATE, 'history')
  const decHistoryNum = mori.dec(historyNum)
  window.NEXT_STATE = window.HISTORY_STATE[decHistoryNum]
}

function goForward () {
  const historyNum = mori.get(window.CURRENT_STATE, 'history')
  const incHistoryNum = mori.inc(historyNum)
  window.NEXT_STATE = window.HISTORY_STATE[incHistoryNum]
}

function changeView (num) {
  const state = window.CURRENT_STATE
  const newState = mori.assoc(state, 'view', num)
  window.NEXT_STATE = newState
}

function toggleModal (modalType) {
  let newState = mori.assocIn(window.CURRENT_STATE, ['modal', 'modalType'], modalType)
  window.NEXT_STATE = newState
}

function newFile () {
  window.NEXT_STATE = mori.toClj(window.initialState)
  window.HISTORY_STATE = [window.NEXT_STATE]
}

function Nav () {
  return (
    <nav>
      <ul>
        <li>
          <div className='dropdown'>
            <div>File</div>
            <div className='dropdown-menu'>
              <div onClick={newFile}>New File</div>
              <div onClick={toggleModal.bind(null, 'Save File')}>Save</div>
              <div onClick={toggleModal.bind(null, 'Open File')}>Open</div>
            </div>
          </div>
        </li>
        <li>
          <div className='dropdown'>
            <div>Edit</div>
            <div className='dropdown-menu'>
              <div onClick={goBack}>Undo Ctrl+Z</div>
              <div onClick={goForward}>Redo Ctrl+Y</div>
            </div>
          </div>
        </li>
        <li>
          <div className='dropdown'>
            <div>View</div>
            <div className='dropdown-menu'>
              <div onClick={changeView.bind(null, 50)}>50%</div>
              <div onClick={changeView.bind(null, 100)}>100%</div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  )
}

export { Nav, goBack, goForward, toggleModal }
