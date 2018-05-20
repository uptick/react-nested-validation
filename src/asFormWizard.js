import React from 'react'

import {isFunc, capitalize} from './utils'

import asForm from './asForm'

/**
 * HOC to turn a React class into a form.
 */
export default options => Inner => {
  const {initialPage, ...otherOpts} = options

  @asForm(otherOpts)
  class Outer extends React.Component {
    static Form = options.form

    state = {
      page: isFunc(initialPage) ? initialPage(this.props) : initialPage,
      history: [],
      visited: {}
    }

    nextPage = (form, next) => {
      const {onChange} = this.props
      const {page, visited} = this.state
      if (!!form) {
        form.validate(true)
      }
      const firstTime = !visited[page]
      if (!!form && (form.state.errors.counts.error > 0 || (form.state.errors.counts.warning > 0 && firstTime))) {
        onChange(page, form.state)
        this.setState({visited: {...visited, [page]: true}})
      }
      else if (isFunc(next)) {
        next()
      }
      else {
        this.setState({
          page: next,
          visited: {...visited, [page]: true},
          history: [
            ...this.state.history,
            page
          ]
        })
      }
    }

    previousPage = () => {
      const {history} = this.state
      if (history.length > 0) {
        this.setState({
          page: history[history.length - 1],
          history: history.slice(0, history.length - 1)
        })
      }
    }

    renderPage = component => {
      const {page} = this.state
      const funcName = `render${capitalize(page)}`
      return component[funcName]()
    }

    render() {
      return (
        <Inner
          {...this.props}
          nextPage={this.nextPage}
          previousPage={this.previousPage}
          finishWizard={this.finishWizard}
          renderPage={this.renderPage}
        />
      )
    }

  }
  return Outer

}
