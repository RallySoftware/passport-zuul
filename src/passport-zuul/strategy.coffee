passport = require 'passport'
util = require 'util'
BadRequestError = require './errors/BadRequestError'
request = require 'request'

util = require 'util'
lodash = require 'lodash'
async = require 'async'
urlModule = require 'url'

module.exports = class Strategy extends passport.Strategy

	constructor: (options = {}) ->
		options = _.defaults options,
			baseUrl: 'https://rally1.rallydev.com'
			parseRequest: @_parseRequestJson
			attemptsPerZuul: 3

		# BaseUrl will be parsed and turned into an array of options
		if _.isString(options.baseUrl) then options.baseUrl = (url.trim() for url in options.baseUrl)
		
		@name = 'zuul'
		@options = options

	authenticate: (req, res, next) -> # Binding this method will cause passport to fail. the action bindings in the middleware add 'fail',etc. methods.
		sessionId = req.cookies.ZSESSIONID
		if not sessionId then return next()

		# Authorize the key and get user information if available.
		@_authorize (err, user)->
			if err? then @fail new BadRequestError err
			callback(err, user)

	_authorize: (key, callback)->
		@_firstZuulThatWorks(
			(zuulUrl, callback) ->
				request(
					{
						url: urlModule.resolve(zuulUrl, "./key/#{keyId}.js")
						method: 'GET'
						json: true
					},
					callback
				)
			,
			(err, response, body)->
				key = null
				if body?.subscriptionId? and body?.userId?
					key = body
				callback(err, key)
		)
