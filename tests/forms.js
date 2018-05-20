import Form from '../src/Form'

class SubForm extends Form {
}

class ParentForm extends Form {
  nested = {
    sub: SubForm
  }
}

class ArrayForm extends Form {
  nested = [
    SubForm
  ]
}

export {
  SubForm,
  ParentForm,
  ArrayForm
}
