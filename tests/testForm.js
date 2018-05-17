import {expect} from 'code'

import Form from '../src/Form'

describe('Form', function() {

  describe('constructor', function() {

    describe('when empty', function() {
      let form = new Form()

      it('initialises touched to empty object', function() {
        expect(form.state.touched).to.equal({})
      })

    })

  })

})
