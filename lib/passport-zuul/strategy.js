(function() {
  var BadRequestError, Strategy, async, lodash, passport, request, urlModule, util,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  passport = require('passport');

  util = require('util');

  BadRequestError = require('./errors/BadRequestError');

  request = require('request');

  util = require('util');

  lodash = require('lodash');

  async = require('async');

  urlModule = require('url');

  module.exports = Strategy = (function(_super) {
    __extends(Strategy, _super);

    function Strategy(options) {
      var url;
      if (options == null) {
        options = {};
      }
      options = _.defaults(options, {
        baseUrl: 'https://rally1.rallydev.com',
        parseRequest: this._parseRequestJson,
        attemptsPerZuul: 3
      });
      if (_.isString(options.baseUrl)) {
        options.baseUrl = (function() {
          var _i, _len, _ref, _results;
          _ref = options.baseUrl;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            url = _ref[_i];
            _results.push(url.trim());
          }
          return _results;
        })();
      }
      this.name = 'zuul';
      this.options = options;
    }

    Strategy.prototype.authenticate = function(req, res, next) {
      var sessionId;
      sessionId = req.cookies.ZSESSIONID;
      if (!sessionId) {
        return next();
      }
      return this._authorize(function(err, user) {
        if (err != null) {
          this.fail(new BadRequestError(err));
        }
        return callback(err, user);
      });
    };

    Strategy.prototype._authorize = function(key, callback) {
      return this._firstZuulThatWorks(function(zuulUrl, callback) {
        return request({
          url: urlModule.resolve(zuulUrl, "./key/" + keyId + ".js"),
          method: 'GET',
          json: true
        }, callback);
      }, function(err, response, body) {
        key = null;
        if (((body != null ? body.subscriptionId : void 0) != null) && ((body != null ? body.userId : void 0) != null)) {
          key = body;
        }
        return callback(err, key);
      });
    };

    return Strategy;

  })(passport.Strategy);

}).call(this);
