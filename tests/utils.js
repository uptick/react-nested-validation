import React from 'react'
import {JSDOM} from 'jsdom'

function setupJSDOM() {
  const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
  const {window} = jsdom

  function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
                        .filter(prop => typeof target[prop] === 'undefined')
                        .reduce((result, prop) => ({
                          ...result,
                          [prop]: Object.getOwnPropertyDescriptor(src, prop)
                        }), {})
    Object.defineProperties(target, props)
  }

  global.window = window
  global.document = window.document
  global.navigator = {
    userAgent: 'node.js'
  }
  copyProps(window, global)
}

const wrapper = Inner =>

  class extends React.Component {

    state = {
      form: null
    }

    handleChange = form => {
      this.setState({form})
    }

    render() {
      const {form} = this.state
      return (
        <div>
          <Inner
            form={form}
            onChange={this.handleChange}
          />
        </div>
      )
    }

  }

export {
  wrapper,
  setupJSDOM
}
