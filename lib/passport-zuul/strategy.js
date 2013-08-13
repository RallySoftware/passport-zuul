(function() {
  var BadRequestError, Strategy, passport, request, util,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  passport = require('passport');

  util = require('util');

  BadRequestError = require('./errors/BadRequestError');

  request = require('request');

  util = require('util');

  module.exports = Strategy = (function(_super) {
    __extends(Strategy, _super);

    function Strategy(options) {
      if (options == null) {
        options = {};
      }
      if (options.baseUrl == null) {
        options.baseUrl = 'https://login.rallydev.com';
      }
      if (options.parseRequest == null) {
        options.parseRequest = this._parseRequestJson;
      }
      this.name = 'zuul';
      this.options = options;
    }

    Strategy.prototype.authenticate = function(req) {
      return this._parseRequest(req, function(err, user) {
        var password, username;
        if (err != null) {
          this.fail(new BadRequestError(err));
        }
        if ((user == null) || (user.username == null) || (user.password == null)) {
          return this.fail(new BadRequestError(this.options.badRequestMessage || 'Missing credentials'));
        }
        username = user.username, password = user.password;
        return this._authenticateAtZuul(username, password, this._verify);
      });
    };

    Strategy.prototype._parseRequest = function(req, callback) {
      var self;
      self = this;
      return this.options.parseRequest.call(this, req, function(err, user) {
        return callback.call(self, err, user);
      });
    };

    Strategy.prototype._parseRequestJson = function(req, callback) {
      var password, username;
      if ((req == null) || ((req != null ? req.body : void 0) == null)) {
        callback(this.options.badRequestMessage || 'Missing credentials');
      }
      username = req.body.username;
      password = req.body.password;
      return callback(null, {
        username: username,
        password: password
      });
    };

    Strategy.prototype._authenticateAtZuul = function(username, password, callback) {
      var payload, self, url;
      self = this;
      payload = {
        username: username,
        password: password
      };
      url = "" + this.options.baseUrl + "/key.js";
      return request.put({
        url: url,
        body: payload,
        json: true
      }, function(err, res, body) {
        return callback.call(self, err, res, body);
      });
    };

    Strategy.prototype._verify = function(err, res, body) {
      var credentials;
      if (err != null) {
        return this.error(err);
      }
      if (res.statusCode !== 200) {
        return this.fail(res);
      }
      credentials = body;
      if ((credentials == null) || (credentials.id == null) || (credentials.username == null) || (credentials.userId == null)) {
        return this.fail(res);
      }
      return this.success(credentials);
    };

    return Strategy;

  })(passport.Strategy);

}).call(this);
