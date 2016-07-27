'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getInstrument = require('./get-instrument');

var _getInstrument2 = _interopRequireDefault(_getInstrument);

var _getAccounts = require('./get-accounts');

var _getAccounts2 = _interopRequireDefault(_getAccounts);

var _postUserSettings = require('./post-user-settings');

var _postUserSettings2 = _interopRequireDefault(_postUserSettings);

var _postUserLists = require('./post-user-lists');

var _postUserLists2 = _interopRequireDefault(_postUserLists);

var _postJson = require('./post-json');

var _postJson2 = _interopRequireDefault(_postJson);

var _putJson = require('./put-json');

var _putJson2 = _interopRequireDefault(_putJson);

var _ping = require('./ping');

var _ping2 = _interopRequireDefault(_ping);

var _forbidden = require('./forbidden');

var _forbidden2 = _interopRequireDefault(_forbidden);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getInstrument: _getInstrument2.default,
  getAccounts: _getAccounts2.default,
  postUserSettings: _postUserSettings2.default,
  postUserLists: _postUserLists2.default,
  postJson: _postJson2.default,
  putJson: _putJson2.default,
  ping: _ping2.default,
  forbidden: _forbidden2.default
};