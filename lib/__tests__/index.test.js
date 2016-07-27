'use strict';

var _testHelper = require('test-helper');

var _expectations = require('./expectations');

var _expectations2 = _interopRequireDefault(_expectations);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(done, _ref) {
  var _this = this;

  var request = _ref.request;
  var response = _ref.response;

  _testHelper.initSandBox.apply(this);
  _testHelper.respondWith.call(this, response);
  _testHelper.execute.apply(null, request).then(function (res) {
    return _this.response = res;
  }, function (res) {
    return _this.response = res;
  }).then(function () {
    return done();
  }).catch(function () {
    return done();
  });
}

function verifyExpectations(expected) {
  Object.keys(expected).forEach(function (key) {
    return it('should have expected ' + key, function () {
      _testHelper.expectations[key].call(this, expected[key]);
    });
  });
}

function test(_ref2) {
  var conditions = _ref2.conditions;
  var expected = _ref2.expected;

  return function () {
    beforeEach(function (done) {
      init.call(this, done, conditions);
    });

    afterEach(function () {
      this.sandbox.restore();
    });

    verifyExpectations.call(this, expected);
  };
}

function testRejected(conditions) {
  return function () {
    return conditions.forEach(function (condition) {
      return Object.keys(_index2.default).filter(function (method) {
        return method !== 'setConfig';
      }).forEach(testMethodRejected(condition));
    });
  };
}

function testMethodRejected(condition) {
  return function (method) {
    return it('should reject promise with an error for ' + method + ' and url \'' + condition + '\'', function () {
      return (0, _chai.expect)(_index2.default[method](condition)).to.be.rejectedWith(Error);
    });
  };
}

describe('api', function () {
  describe('when url is invalid', testRejected([undefined, '']));
  describe('when required path params are missing', testRejected(['/api/2/accounts/{accno}']));
  describe('when request succeeded', test(_expectations2.default.getInstrument));
  describe.skip('when request failed', test(_expectations2.default.getAccounts));
  describe('when response is not JSON', test(_expectations2.default.ping));
  describe('when making POST request', test(_expectations2.default.postUserLists));
  describe('when making POST request with JSON payload', test(_expectations2.default.postUserSettings));
  describe('when making POST JSON request', test(_expectations2.default.postJson));
  describe('when making PUT JSON request', test(_expectations2.default.putJson));
  describe.skip('when making POST JSON failed request', test(_expectations2.default.forbidden));
});