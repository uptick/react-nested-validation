import {expect} from 'code'

import {isNil} from '../src/utils'

describe('isNil', function() {

  it('works', function() {
    expect(isNil(undefined)).to.be.true()
    expect(isNil(null)).to.be.true()
    expect(isNil('')).to.be.true()
    expect(isNil(0)).to.be.false()
    expect(isNil('a')).to.be.false()
    expect(isNil(false)).to.be.false()
  })

})
