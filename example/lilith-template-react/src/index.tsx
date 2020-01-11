import React, { Component } from 'react'
import { render } from 'react-dom'
import { login } from './services'


export default class __name_pascal__ extends Component {

  componentDidMount() {   
    login
    .register({ param: 'param', version: 1 })
    .then(({ code, data, message }) => {
      // 因为有确定的 Response 类型 TS可以提供精准的提示，
      console.log(code, message)
    })
        
  }

  render() {
    return (
      <div>
        Hello World !!! {{name}}
      </div>
    )
  }
}
