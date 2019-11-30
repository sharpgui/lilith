import React, { Component } from 'react'
import { render } from 'react-dom'

export default class {{name|pascal}} extends Component {
  render() {
    return (
      <div>
        Hello World!11111234234{{name}}
      </div>
    )
  }
}

render(<{{name|pascal}}></{{name|pascal}}>, document.getElementById('root'))