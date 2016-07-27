'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.setConfig = setConfig;
exports.get = get;
exports.post = post;
exports.postJson = postJson;
exports.put = put;
exports.putJson = putJson;
exports.del = del;

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

require('isomorphic-fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_es6Promise2.default.polyfill();

var HTTP_NO_CONTENT = 204;
var HTTP_BAD_REQUEST = 400;
var regUrlParam = /{([\s\S]+?)}/g;

var defaultHeaders = {
  accept: 'application/json'
};

var postDefaultHeaders = Object.assign({
  'content-type': 'application/x-www-form-urlencoded'
}, defaultHeaders);

var state = {
  nTag: 'NO_NTAG_RECEIVED_YET'
};

var credentials = 'include';

var config = {};
var configKeys = ['root'];

function setConfig() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  configKeys.forEach(function (key) {
    return config[key] = options[key];
  });

  if (options.nTag) {
    state.nTag = options.nTag;
  }
  if (options.clientId) {
    defaultHeaders['client-id'] = options.clientId;
  }
}

function get(url) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var headers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var options = {
    url: url,
    params: params,
    headers: headers,
    method: 'get'
  };

  return httpFetch(options);
}

function post(url) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var headers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var options = {
    url: url,
    params: params,
    headers: headers,
    method: 'post'
  };

  return httpFetch(options);
}

function postJson(url) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var headers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var merge = function merge(one, two) {
    return Object.assign({}, one, two);
  };
  return post(url, params, merge(headers, { 'Content-type': 'application/json' }));
}

function put(url) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var headers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var options = {
    url: url,
    params: params,
    headers: headers,
    method: 'put'
  };

  return httpFetch(options);
}

function putJson(url) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var headers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var merge = function merge(one, two) {
    return Object.assign({}, one, two);
  };
  return put(url, params, merge(headers, { 'Content-type': 'application/json' }));
}

function del(url) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var headers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var options = {
    url: url,
    params: params,
    headers: headers,
    method: 'delete'
  };

  return httpFetch(options);
}

exports.default = {
  get: get,
  post: post,
  postJson: postJson,
  put: put,
  putJson: putJson,
  del: del,
  setConfig: setConfig
};


function httpFetch(options) {
  if (!options.url) {
    // @TODO should check type
    return Promise.reject(new Error('Invalid url, got `' + options.url + '`'));
  }

  if (isNotValidPath(options.url, options.params)) {
    // @TODO should check types
    return Promise.reject(new Error('Params object doesn\'t have all required keys for url.\n      Got url `' + options.url + '` and params `' + JSON.stringify(options.params) + '`'));
  }

  var path = buildPath(options.url, options.params);
  var params = omit(options.params, getPathParams(options.url));

  var query = hasQuery(options.method) ? buildParams(params) : undefined;
  var headers = buildHeaders(options.method, options.headers);
  var body = buildBody(options.method, params, headers);

  var fetchUrl = buildUrl(path, query);

  var fetchParams = {
    headers: headers,
    credentials: credentials,
    body: body,
    method: options.method
  };

  return fetch(fetchUrl, fetchParams).then(validateStatus).then(saveNTag).then(processResponse);
}

function validateStatus(response) {
  if (response.status < HTTP_BAD_REQUEST) {
    return response;
  }

  return toErrorResponse(response);
}

function toErrorResponse(response) {
  return parseContent(response).then(function (res) {
    return Promise.reject(res);
  });
}

function saveNTag(response) {
  state.nTag = response.headers.get('ntag') || state.nTag;
  return response;
}

function processResponse(response) {
  if (response.status === HTTP_NO_CONTENT) {
    return { response: response, status: response.status };
  }

  return parseContent(response);
}

function parseContent(response) {
  var contentType = response.headers.get('Content-type');
  var method = isJSON(contentType) ? 'json' : 'text';

  return response[method]().then(function (data) {
    return { response: response, data: data, status: response.status };
  }).catch(function (error) {
    return Promise.reject({
      response: response,
      status: response.status,
      error: new Error('fetch unable to parse input, most likely API responded with empty reponse.\n        Original Error: ' + error)
    });
  });
}

function isJSON(contentType) {
  return contains('application/json')(contentType);
}

function getPathParams(url) {
  var keys = url.match(regUrlParam) || [];
  return keys.map(function (key) {
    return key.replace(/({|})/g, '');
  });
}

function buildUrl(path) {
  var query = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

  var queryParams = query.length ? query.join('&') : '';
  var pathContainsQuery = path.indexOf('?') !== -1;
  var pathContainsProtocol = !!path.match(/^http(s)?:\/\//);

  var root = '';
  if (!pathContainsProtocol && typeof config.root !== 'undefined') {
    root = config.root;
  }

  var delimiter = '';
  if (pathContainsQuery && queryParams) {
    delimiter = '&';
  } else if (queryParams) {
    delimiter = '?';
  }

  return '' + root + path + delimiter + queryParams;
}

function isNotValidPath(url) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return !!(url.match(regUrlParam) || []).map(function (key) {
    return key.replace(/({|})/g, '');
  }).find(function (key) {
    return !params[key];
  });
}

function buildPath(url, params) {
  return url.replace(regUrlParam, matchParams(params));
}

function matchParams(params) {
  return function matchParamKeyValue(match, key) {
    return uriEncode(params[key]);
  };
}

function buildParams() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return Object.keys(params).map(function (key) {
    return encodeURIComponent(key) + '=' + uriEncode(params[key]);
  });
}

function buildHeaders(method, headers) {
  return Object.assign({ ntag: state.nTag }, getDefaultMethodHeaders(method), sanitizeHeaders(headers));
}

function getDefaultMethodHeaders(method) {
  return method === 'post' || method === 'put' ? postDefaultHeaders : defaultHeaders;
}

function sanitizeHeaders(obj) {
  return Object.keys(obj).reduce(keyToLowerCase(obj), {});
}

function keyToLowerCase(obj) {
  return function (accumulator, key) {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  };
}

function buildBody(method, params, headers) {
  if (!hasBody(method)) {
    return undefined;
  }

  return isJsonContentType(headers) ? JSON.stringify(params) : buildParams(params).join('&');
}

function isJsonContentType(headers) {
  var contentType = Object.keys(headers).find(contains('content-type'));
  return isJSON(headers[contentType]);
}

function uriEncode(value) {
  var encoded = void 0;
  if (Array.isArray(value)) {
    encoded = value.join(',');
  } else if (isPlainObject(value)) {
    encoded = JSON.stringify(value);
  } else {
    encoded = value;
  }

  return encodeURIComponent(encoded);
}

function hasQuery(method) {
  return method === 'get' || method === 'delete';
}

function hasBody(method) {
  return method === 'post' || method === 'put';
}

function contains(string) {
  return function (value) {
    return !!value && value.toLowerCase().indexOf(string) !== -1;
  };
}

function omit(source, props) {
  return Object.keys(source).reduce(omitKey(source, props), {});
}

function omitKey(source, props) {
  return function (accumulator, key) {
    if (props.indexOf(key) === -1) {
      accumulator[key] = source[key];
    }

    return accumulator;
  };
}

function isPlainObject(obj) {
  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}