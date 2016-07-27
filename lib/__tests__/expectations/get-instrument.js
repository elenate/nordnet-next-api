'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var params = { instrument_id: 123, positions: [456, 789], accno: 987 };
var headers = { 'Accept-Language': 'sv' };

exports.default = {
  conditions: {
    request: [_index2.default.get, ['/api/2/instruments/{instrument_id}?positions={positions}', params, headers]],
    response: ['GET', '/api/2/instruments/123?positions=456%2C789&accno=987', [200, { 'Content-Type': 'application/json; charset=UTF-8' }, JSON.stringify({ instrument_id: 123 })]]
  },
  expected: {
    url: '/api/2/instruments/123?positions=' + encodeURIComponent('456,789') + '&accno=987',
    headers: { 'accept-language': 'sv', accept: 'application/json', ntag: 'NO_NTAG_RECEIVED_YET' },
    method: 'get',
    credentials: true,
    body: undefined,
    status: 200,
    data: { instrument_id: 123 },
    response: true
  }
};