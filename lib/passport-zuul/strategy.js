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
      this.parseRequestJson = __bind(this.parseRequestJson, this);
      if (options.baseUrl == null) {
        options.baseUrl = 'https://login.rallydev.com';
      }
      if (options.parseRequest == null) {
        options.parseRequest = this.parseRequestJson;
      }
      this.name = 'zuul';
      this.options = options;
    }

    Strategy.prototype.parseRequestJson = function(req) {
      var password, username, _ref, _ref1;
      username = req != null ? (_ref = req.body) != null ? _ref.username : void 0 : void 0;
      password = req != null ? (_ref1 = req.body) != null ? _ref1.password : void 0 : void 0;
      console.log("username: " + username);
      return {
        username: username,
        password: password
      };
    };

    Strategy.prototype.authenticate = function(req) {
      var password, username, _ref;
      _ref = this.options.parseRequest(req), username = _ref.username, password = _ref.password;
      if ((username == null) || (password == null)) {
        return this.fail(new BadRequestError(this.options.badRequestMessage || 'Missing credentials'));
      }
      return this.verify(req, username, password);
    };

    Strategy.prototype.verify = function(req, username, password) {
      var payload, url,
        _this = this;
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
