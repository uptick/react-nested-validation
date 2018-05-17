// forms.js

import {Form, required} from 'react-nested-validation'

class PersonForm extends Form {
  fieldValidators = {
    name: [
      required()
    ]
  }
}

class PersonListForm extends Form {
  nested = [
    PersonForm
  ]
}

class MovieForm extends Form {
  fieldValidators = {
    title: [
      required()
    ]
  }
}

class MovieAndActorsForm extends Form {
  nested = {
    movie: MovieForm,
    director: PersonForm,
    actors: PersonListForm
  }

  validateForm(errorSet) {
    if (this.isTouched('movie.title') && this.getValue('movie.title') == 'Jaws') {
      errorSet.addFormError({
        type: Form.WARNING,
        message: 'Good choice!'
      })
    }
  }
}

export {
  PersonForm,
  PersonListForm,
  MovieForm,
  MovieAndActorsForm
}
