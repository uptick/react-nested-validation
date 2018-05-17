# react-nested-validation

A toolkit for performing nested validation of React forms. Please find
a [live demo here](https://uptick.github.io/react-nested-validation/).

## Rationale

There is a diverse array of React packages designed to help render
and validate forms. However there was no obvious choice that provided
the following features:

 * Ability to deeply nest forms and collate errors at the top level.
 
 * Allow for complex validation rules.
 
 * Unopinionated about how to render presentational components.
 
We found a need for a light weight validation toolkit that could be
used with a variety of presentational frameworks, and so we made
`react-nested-validation`.

## Design

There are three main components:

 * Forms.
 
 * Validator functions.
 
 * React component wrappers.
 
Forms are the main interface for designing both the validation, and
the nested structure of your validation. Forms are ES6 classes that
contain links to subforms, and allow for methods to be overidden in
order to validate both fields and general form errors.

Validator functions are conveniences for performing common validation
operations, e.g. required fields.

The React component wrappers are two higher-order components to help
apply `Form`s to your presentational React comonents.

## Basic example

```javascript
import Form, {required} from 'react-nested-validation'

class MovieForm extends Form {
  fieldValidators = {
    title: required()
  }
}
```

```javascript
import React from 'react'
import {asForm} from 'react-nested-validation'

@asForm({form: BasicForm})
class Movie extends React.Component {
  render() {
    const {form} = this.props
    const {values, errors, touched} = form
    return (
      <div>
        <input
          name="title"
          value={values.title}
        />
        <input
          name="year"
          value={values.year}
        />
      </div>
    )
  }
}
```

## Nested example

```javascript
import Form, {required} from 'react-nested-validation'

class DirectorForm extends Form {
  fieldValidators = {
    name: required()
  }
}

class MovieForm extends Form {
  fieldValidators = {
    title: required()
  }
  nested = {
    director: DirectorForm
  }
}
```

```javascript
import React from 'react'
import {asForm} from 'react-nested-validation'

@asForm({form: SubForm})
class Sub extends React.Component {
  render() {
    const {form} = this.props
    const {values, errors, touched} = form
    // Render your form here.
  }
}

@asForm({form: SuperForm})
class Super extends React.Component {
  render() {
    const {form} = this.props
    const {values, errors, touched} = form
    return (
      <div>
        <Sub
          form={values.sub}
          prefix="sub"
        />
      </div>
    )
  }
}
```

## Array example

```javascript
import Form, {required} from 'react-nested-validation'

class MovieForm extends Form {
  fieldValidators = {
    title: required()
  }
}

class MovieListForm extends Form {
  nested = [
    MovieForm
  ]
}
```

```javascript
import React from 'react'
import {asForm} from 'react-nested-validation'

@asForm({form: SubForm})
class Sub extends React.Component {
  render() {
    const {form} = this.props
    const {values, errors, touched} = form
    // Render your form here.
  }
}

@asForm({form: SuperForm})
class Super extends React.Component {
  render() {
    const {form} = this.props
    const {values, errors, touched} = form
    return (
      <div>
        {
          values.map((sub, ii) => (
            <Sub
              form={sub}
              prefix={ii}
            />
          ))
        }
      </div>
    )
  }
}
```
