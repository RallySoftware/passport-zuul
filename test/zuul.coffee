passportZuul = require '../src/passport-zuul'
require 'should'

describe 'Array', () ->
	describe '#indexOf', () ->
		it 'should return something', () ->
			[1,2,3].indexOf(5).should.equal(-1)
