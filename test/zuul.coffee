# passportZuul = require '../src/passport-zuul'

# should = require 'should'
# sinon = require 'sinon'
# nock = require 'nock'

# describe 'Zuul Strategy', () ->

# 	it 'should use https://login.rallydev.com by default', () ->
# 		strategy = new passportZuul.Strategy
# 		strategy.options.baseUrl.should.equal 'https://login.rallydev.com'

# 	it 'should use a supplied parsing function', () ->
# 		spy = sinon.spy()
# 		strategy = new passportZuul.Strategy {
# 			parseRequest: spy
# 		}
# 		strategy._parseRequest null, () ->
# 			spy.called.should.be.true

# 	it 'should fail if the request parser returns an error', () ->
# 		strategy = new passportZuul.Strategy
# 			parseRequest: (req, callback) -> callback "error"
		
# 		spy = sinon.spy()
# 		strategy.fail = spy
# 		strategy.authenticate null
# 		spy.called.should.be.true

# 	it 'should fail if the request parser returns a bad user object', () ->
# 		strategy = new passportZuul.Strategy
# 			parseRequest: (req, callback) -> callback null, {}
		
# 		spy = sinon.spy()
# 		strategy.fail = spy
# 		strategy.authenticate null
# 		spy.called.should.be.true


# 	it 'should request from a supplied baseUrl', () ->
# 		strategy = new passportZuul.Strategy
# 			baseUrl: 'http://zuul.test'
		
# 		request = nock('http://zuul.test').put('/key.js').reply(200, {})
# 		strategy._authenticateAtZuul null, null, () ->
# 			request.isDone().should.be.true

# 	it 'the default parser should parse the request body as an object', () ->
# 		username = 'username'
# 		password = 'password'
# 		req  =
# 			body:
# 				username: username
# 				password: password

# 		strategy = new passportZuul.Strategy
# 		strategy._parseRequest req, (err, user) ->
# 			should.not.exist err
# 			user.username.should.equal username
# 			user.password.should.equal password

# 	describe 'verification of zuul response', () ->

# 		fail = null
# 		success = null
# 		error = null
# 		strategy = null

# 		beforeEach () ->
# 			strategy = new passportZuul.Strategy
# 				baseUrl: 'http://zuul.test'
# 			strategy.fail = fail = sinon.spy()
# 			strategy.success = success = sinon.spy()
# 			strategy.error = error = sinon.spy()

# 		it 'should error if zuul returns an error', ()->
# 			strategy._verify "error", null, null
# 			error.called.should.be.true

# 		it 'should fail if credentials are malformed', ()->
# 			strategy._verify null, {statusCode: 200}, {}
# 			fail.called.should.be.true

# 		it 'should fail if zuul status code is not 200', ()->
# 			strategy._verify null, {statusCode: 404}, {id:1, username:'username',userId:'userId'}
# 			fail.called.should.be.true

# 		it 'should succeed if zuul status 200 with proper credentials', ()->
# 			strategy._verify null, {statusCode: 200}, {id:1, username:'username', userId:'userId'}
# 			fail.called.should.be.false
# 			error.called.should.be.false
# 			success.called.should.be.true
