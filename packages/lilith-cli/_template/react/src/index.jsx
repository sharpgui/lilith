import React, { Component } from 'react'
import { render } from 'react-dom'
import Button from './components/button'

export default class App extends Component {
  render() {
    return (
      <div>
        Hello World !
        <Button />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
