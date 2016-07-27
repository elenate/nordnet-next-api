'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var name = 'name';
var payload = { name: name };

exports.default = {
  conditions: {
    request: [_index2.default.postJson, ['/api/2/user/lists', payload]],
    response: ['POST', '/api/2/user/lists', [403, { 'Content-type': 'application/json; charset=UTF-8' }, JSON.stringify({ code: 'NEXT_INVALID_SESSION' })]]
  },
  expected: {
    url: '/api/2/user/lists',
    headers: { 'content-type': 'application/json', accept: 'application/json', ntag: 'NO_NTAG_RECEIVED_YET' },
    method: 'post',
    credentials: true,
    body: undefined,
    status: 403,
    data: { code: 'NEXT_INVALID_SESSION' },
    response: true
  }
};