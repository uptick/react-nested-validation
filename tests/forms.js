import Form from '../src/Form'
import {required} from '../src/validators'

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

class FormA extends Form {
  nested = {
    a: ArrayForm
  }
}

class FormB extends Form {
  nested = {
    b: ArrayForm
  }
}

class MultiForm extends Form {
  multi = [
    FormA,
    FormB
  ]
}

class RequiredFieldForm extends Form {
  fieldValidators = {
    f0: [
      required()
    ]
  }
}

export {
  SubForm,
  ParentForm,
  ArrayForm,
  FormA,
  FormB,
  MultiForm,
  RequiredFieldForm
}
