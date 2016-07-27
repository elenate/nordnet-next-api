'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var name = 'abc';
var params = { name: name };
var response = { id: 1, name: name };

exports.default = {
  conditions: {
    request: [_index2.default.post, ['/api/2/user/lists', params]],
    response: ['POST', '/api/2/user/lists', [201, { 'Content-type': 'application/json; charset=UTF-8' }, JSON.stringify(response)]]
  },
  expected: {
    url: '/api/2/user/lists',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json', ntag: 'NO_NTAG_RECEIVED_YET' },
    method: 'post',
    credentials: true,
    body: 'name=' + name,
    status: 201,
    data: response,
    response: true
  }
};