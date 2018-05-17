// components.js

import React from 'react'
import ReactDOM from 'react-dom'
import {asForm} from 'react-nested-validation'

import {MovieForm, PersonForm, PersonListForm, MovieAndActorsForm} from './forms'

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

@asForm({form: PersonForm})
class Actor extends React.Component {
  render() {
    const {form, onChange} = this.props
    const {values, errors, touched} = form
    return (
      <div>
        <div>
          <label>Actor name </label>
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

@asForm({form: PersonListForm})
class ActorList extends React.Component {
  render() {
    const {form, onChange} = this.props
    const {values, errors, touched} = form
    return (
      <div>
        <div>
          {
            values.map((x, ii) =>
              <Actor
                key={ii}
                form={x}
                formPrefix={ii}
                onChange={onChange}
              />
            )
          }
        </div>
        <button
          onClick={() => onChange(null, {})}
        >
          Add actor
        </button>
        <button
          onClick={() => onChange(values.length - 1, null)}
        >
          Remove last actor
        </button>
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
@asForm({form: MovieAndActorsForm})
class MovieAndActors extends React.Component {
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
        <ActorList
          form={values.actors}
          formPrefix="actors"
          onChange={onChange}
        />
      </div>
    )
  }
}

const mount = document.querySelectorAll('div.demo-array')
ReactDOM.render(<MovieAndActors />, mount[0])
