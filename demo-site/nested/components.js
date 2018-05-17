// components.js

import React from 'react'
import ReactDOM from 'react-dom'
import {asForm} from 'react-nested-validation'

import {MovieForm, PersonForm, MovieAndDirectorForm} from './forms'

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
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </div>
      )
    }
  }

@asForm({form: PersonForm})
class Director extends React.Component {
  render() {
    const {form, onChange} = this.props
    const {values, errors, touched} = form
    return (
      <div>
        <div>
          <label>Director name </label>
          <input
            name="name"
            value={values.name || ''}
            onChange={ev => onChange('name', ev.target.value)}
          />
        </div>
      </div>
    )
  }
}

@asForm({form: MovieForm})
class Movie extends React.Component {
  render() {
    const {form, onChange} = this.props
    const {values, errors, touched} = form
    return (
      <div>
        <div>
          <label>Title </label>
          <input
            name="title"
            value={values.title || ''}
            onChange={ev => onChange('title', ev.target.value)}
          />
        </div>
        <div>
          <label>Year </label>
          <input
            name="year"
            value={values.year || ''}
            onChange={ev => onChange('year', ev.target.value)}
          />
        </div>
      </div>
    )
  }
}

@wrapper
@asForm({form: MovieAndDirectorForm})
class MovieAndDirector extends React.Component {
  render() {
    const {form, onChange} = this.props
    const {values} = form
    return (
      <div>
        <Movie
          form={values.movie}
          formPrefix="movie"
          onChange={onChange}
        />
        <Director
          form={values.director}
          formPrefix="director"
          onChange={onChange}
        />
      </div>
    )
  }
}

const mount = document.querySelectorAll('div.demo-nested')
ReactDOM.render(<MovieAndDirector />, mount[0])

export {
  Movie
}
