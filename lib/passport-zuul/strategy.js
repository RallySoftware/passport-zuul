(function() {
  var BadRequestError, Strategy, passport, request, util, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  passport = require('passport');

  util = require('util');

  BadRequestError = require('./errors/BadRequestError');

  request = require('request');

  _ = require('underscore');

  module.exports = Strategy = (function(_super) {
    __extends(Strategy, _super);

    function Strategy(options) {
      if (options == null) {
        options = {};
      }
      this._verify = __bind(this._verify, this);
      this._authenticateAtZuul = __bind(this._authenticateAtZuul, this);
      this._parseRequestJson = __bind(this._parseRequestJson, this);
      this._parseRequest = __bind(this._parseRequest, this);
      this.authenticate = __bind(this.authenticate, this);
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
      var _this = this;
      return this._parseRequest(req, function(err, user) {
        var password, username;
        if (err != null) {
          _this.fail(new BadRequestError(err));
        }
        if ((user == null) || (user.username == null) || (user.password == null)) {
          return _this.fail(new BadRequestError(_this.options.badRequestMessage || 'Missing credentials'));
        }
        username = user.username, password = user.password;
        return _this._verify(username, password);
      });
    };

    Strategy.prototype._parseRequest = function(req, callback) {
      return this.options.parseRequest(req, callback);
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
      var payload, url;
      payload = {
        username: username,
        password: password
      };
      url = "" + this.options.baseUrl + "/key.js";
      return request.put({
        url: url,
        body: payload,
        json: true
      }, callback);
    };

    Strategy.prototype._verify = function(username, password) {
      var _this = this;
      return this._authenticateAtZuul(username, password, function(err, res, body) {
        var credentials;
        if (err != null) {
          _this.error(err);
        }
        if (res.statusCode !== 200) {
          _this.fail(res);
        }
        credentials = body;
        if (!(typeof credentials === "function" ? credentials((credentials.id == null) || (credentials.username == null) || (credentials.userId == null)) : void 0)) {
          _this.fail(res);
        }
        return _this.success(credentials);
      });
    };

    return Strategy;

  })(passport.Strategy);

}).call(this);
