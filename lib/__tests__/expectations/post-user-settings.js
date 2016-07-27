'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var params = { key: 1, settings: { widgets: [{ id: 1, name: 'winners/losers' }] } };
var headers = { 'content-type': 'application/json' };

exports.default = {
  conditions: {
    request: [_index2.default.post, ['/api/2/user/settings/{key}', params, headers]],
    response: ['POST', '/api/2/user/settings/1', [201, { 'Content-type': 'application/json; charset=UTF-8' }, JSON.stringify(params)]]
  },
  expected: {
    url: '/api/2/user/settings/1',
    headers: { 'content-type': 'application/json', accept: 'application/json', ntag: 'NO_NTAG_RECEIVED_YET' },
    method: 'post',
    credentials: true,
    body: JSON.stringify({ settings: params.settings }),
    status: 201,
    data: params,
    response: true
  }
};