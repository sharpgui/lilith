import React, { Component } from 'react'
import { render } from 'react-dom'

class App extends Component {
  render() {
    return (
      <div>
        Hello World!
      </div>
    )
  }
}

render(<App></App>, document.getElementById('root'))