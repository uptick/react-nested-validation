// forms.js

import {Form, required} from 'react-nested-validation'

class MovieForm extends Form {
  fieldValidators = {
    title: [
      required()
    ]
  }
}

export {
  MovieForm
}
