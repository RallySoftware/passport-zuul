# passport-zuul [![Build Status](https://secure.travis-ci.org/RallySoftware/passport-zuul.png?branch=master)](http://travis-ci.org/RallySoftware/passport-zuul)

https://github.com/RallySoftware/passport-zuul

## Getting Started
Install the module with: `npm install passport-zuul`

```javascript
ZuulStrategy = require('passport-zuul').Strategy
passport.use new ZuulStrategy
passport.serializeUser (user, done) -> 
  done null, JSON.stringify(user)
passport.deserializeUser (user, done) -> 
  done null, JSON.parse(user)

### Other Middleware here, including your session set-up ###

# Passport authentication and session management
app.use passport.initialize()
app.use passport.session()

app.use app.router
```

In your Express routes, you might do something like the following to ensure that all endpoints require authentication.

```javascript
ensureAuthenticated = (req, res, next) ->
  if req.isAuthenticated() or req.path is '/login'
    return next()
  else
    res.render '401', status: 401, view: 'four-o-one'
    
module.exports = (app) ->
  app.all '*', ensureAuthenticated
  # Index
  app.post '/login', passport.authenticate('zuul'), (req, res, next) -> res.json req.user
```

## Documentation
This strategy for [Passport](http://passportjs.org/) authentication in Node.js will operate on the ALM Zuul api. When using this strategy 'req.user' will be the key/username object returned by 'zuul_base_url/key.js'. This includes a username, userId, and token id.

Supports specifying the Zuul base url.
```javascript
passport.use new ZuulStrategy { baseUrl: 'https://login.rallydev.com' }
```

By default passport.authenticate('zuul') will parse the request body as a JSON object with 'username' and 'password' properties. This can be overridden if you have a different approach.
```javascript
passport.use new ZuulStrategy { 
  parseRequest: (req) ->
  	return {username: req.query.the_name, password: req.query.the_password } 
}
```

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Patrick Winters. Licensed under the MIT license.
