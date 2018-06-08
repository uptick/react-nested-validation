import Form from '../src/Form'
import {required} from '../src/validators'

class SubForm extends Form {
}

class ParentForm extends Form {

  nested = {
    sub: SubForm
  }

  initialSub(values) {
    return values.sub
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

  initialA(values) {
    return values.a
  }

}

class FormB extends Form {

  nested = {
    b: ArrayForm
  }

  initialA(values) {
    return values.b
  }

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
  RequiredFieldForm
}
