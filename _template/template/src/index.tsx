import React, { Component } from 'react'
import { render } from 'react-dom'
import { getData } from './services'


export default class {{name|pascal}} extends Component {
  componentDidMount() {
    getData().then(res => {
      console.log(res)
    })
  }

  render() {
    return (
      <div>
        Hello World !
      </div>
    )
  }
}