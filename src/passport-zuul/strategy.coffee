passport = require 'passport'
util = require 'util'
BadRequestError = require './errors/BadRequestError'
request = require 'request'

util = require 'util'

module.exports = class Strategy extends passport.Strategy

	constructor: (options = {}) ->
		if not options.baseUrl? then options.baseUrl = 'https://login.rallydev.com'
		if not options.parseRequest? then options.parseRequest = @_parseRequestJson
		@name = 'zuul'
		@options = options

	authenticate: (req) -> # Binding this method will cause passport to fail. the action bindings in the middleware add 'fail',etc. methods.
		@_parseRequest req, (err, user) ->
			if err? then @fail new BadRequestError err
			
			if not user? or not user.username? or not user.password?
				return @fail new BadRequestError @options.badRequestMessage || 'Missing credentials'

			{username, password} = user
			@_authenticateAtZuul username, password, @_verify

	# Parse a login/authentication request and supply the callback with a user object
	_parseRequest: (req, callback) ->
		self = @
		@options.parseRequest.call @, req, (err, user) ->
			callback.call self, err, user

	# Default request parser expects to be supplied with a JSON object with username and password properties
	_parseRequestJson: (req, callback) ->
		if not req? or not req?.body? then callback @options.badRequestMessage || 'Missing credentials'
		username = req.body.username
		password = req.body.password
		callback null, {
			username:username
			password:password
		}

	_authenticateAtZuul: (username, password, callback) ->
		self = @
		payload = {username, password}
		url = "#{@options.baseUrl}/key.js"
		request.put {url: url, body:payload, json:true}, (err, res, body) ->
			callback.call self, err, res, body
		
		
	_verify: (err, res, body) ->
		if err? then return @error err
		if res.statusCode isnt 200 then return @fail res
		credentials = body
		if not credentials? or not credentials.id? or not credentials.username? or not credentials.userId? then return @fail res
		return @success credentials
