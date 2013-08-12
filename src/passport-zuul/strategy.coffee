passport = require 'passport'
util = require 'util'
BadRequestError = require './errors/BadRequestError'
request = require 'request'
_ = require 'underscore'

module.exports = class Strategy extends passport.Strategy

	constructor: (options = {}) ->
		if not options.baseUrl? then options.baseUrl = 'https://login.rallydev.com'
		if not options.parseRequest? then options.parseRequest = @parseRequestJson
		@name = 'zuul'
		@options = options

	parseRequestJson: (req) =>
		username = req?.body?.username
		password = req?.body?.password
		console.log "username: #{username}"
		return {username, password}

	authenticate: (req) -> # Binding this method will cause passport to fail. the action bindings in the middleware add 'fail',etc. methods.
		{username, password} = @options.parseRequest req
		if not username? or not password?
			return @fail new BadRequestError @options.badRequestMessage || 'Missing credentials'

		@verify req, username, password

	verify: (req, username, password) ->
		payload = {username, password}
		url = "#{@options.baseUrl}/key.js"
		request.put {url: url, body:payload, json:true}, (err, res, body) =>
			if err? then @error err
			if res.statusCode isnt 200 then @fail res
			credentials = body
			if not credentials? not credentials.id? or not credentials.username? or not credentials.userId? then @fail res
			@success credentials
