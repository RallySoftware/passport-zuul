
module.exports = class BadRequestError extends Error
	constructor: (message) ->
		Error.call @
		Error.captureStackTrace @, arguments.callee
		@name = 'BadRequestError'
		@message = if message? then message else null
