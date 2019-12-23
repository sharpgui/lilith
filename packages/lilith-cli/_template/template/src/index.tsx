import React, { Component } from 'react'
import { render } from 'react-dom'
import { getData } from './services'


export default class __name_pascal__ extends Component {
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