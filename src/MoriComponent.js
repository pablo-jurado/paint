import { Component } from 'react'
import mori from 'mori'

const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

// a MoriComponent receives a JavaScript Object with one key: imdata
// imdata should be a mori structure that supports mori.equals() comparisons
class MoriComponent extends Component {
  // only update the component if the mori data structure is not equal
  shouldComponentUpdate (nextProps, _nextState) {
    return !mori.equals(this.props.imdata, nextProps.imdata)
  }
}

export { MoriComponent, log }
