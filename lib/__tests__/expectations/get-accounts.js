'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  conditions: {
    request: [_index2.default.get, ['/api/2/accounts']],
    response: ['GET', '/api/2/accounts', [401, { 'Content-Type': 'application/json; charset=UTF-8' }, JSON.stringify({ code: 'NEXT_INVALID_SESSION' })]]
  },
  expected: {
    url: '/api/2/accounts',
    headers: { accept: 'application/json', ntag: 'NO_NTAG_RECEIVED_YET' },
    method: 'get',
    credentials: true,
    body: undefined,
    status: 401,
    data: { code: 'NEXT_INVALID_SESSION' },
    response: true
  }
};