// forms.js

import {Form, required} from 'react-nested-validation'

class PersonForm extends Form {
  fieldValidators = {
    name: [
      required()
    ]
  }
}

class MovieForm extends Form {
  fieldValidators = {
    title: [
      required()
    ]
  }
}

class MovieAndDirectorForm extends Form {
  nested = {
    movie: MovieForm,
    director: PersonForm
  }
}

export {
  PersonForm,
  MovieForm,
  MovieAndDirectorForm
}
