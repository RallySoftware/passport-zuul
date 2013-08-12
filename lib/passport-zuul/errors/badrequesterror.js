(function() {
  var BadRequestError,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = BadRequestError = (function(_super) {
    __extends(BadRequestError, _super);

    function BadRequestError(message) {
      Error.call(this);
      Error.captureStackTrace(this, arguments.callee);
      this.name = 'BadRequestError';
      this.message = message != null ? message : null;
    }

    return BadRequestError;

  })(Error);

}).call(this);
