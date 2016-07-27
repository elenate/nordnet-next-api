'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  conditions: {
    request: [_index2.default.get, ['/api/2/ping']],
    response: ['GET', '/api/2/ping', [200, {}, 'pong']]
  },
  expected: {
    url: '/api/2/ping',
    status: 200,
    data: 'pong',
    response: true
  }
};