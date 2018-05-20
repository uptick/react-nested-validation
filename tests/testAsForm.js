import React from 'react'
import {expect} from 'code'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Form from '../src/Form'
import asForm from '../src/asForm'

import {SubForm, ParentForm} from './forms'
import {wrapper, setupJSDOM} from './utils'

setupJSDOM()
Enzyme.configure({adapter: new Adapter()})

describe('Simple form', function() {

  class TestForm extends Form {
  }

  @wrapper
  @asForm({form: TestForm})
  class Component extends React.Component {
    render() {
      return null
    }
  }

  describe('initialised with null', function() {
    let component = mount(<Component />)

    it('sets touched to empty object', function() {
      expect(component.state().form.touched).to.equal({})
    })

  })

})

describe('Nested form', function() {

  @asForm({form: SubForm})
  class Sub extends React.Component {
    render() {
      return null
    }
  }

  @wrapper
  @asForm({form: ParentForm})
  class Parent extends React.Component {
    render() {
      const {form, onChange} = this.props
      return (
        <Sub
          form={form.values.sub}
          formPrefix="sub"
          onChange={onChange}
        />
      )
    }
  }

  describe('initialised with null', function() {
    let component = mount(<Parent />)

    it('sets touched to empty object', function() {
      expect(component.state().form.touched).to.equal({})
    })

  })

})
