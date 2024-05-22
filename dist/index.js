(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.I18 = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var queryString = {};

    var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

    var token = '%[a-f0-9]{2}';
    var singleMatcher = new RegExp('(' + token + ')|([^%]+?)', 'gi');
    var multiMatcher = new RegExp('(' + token + ')+', 'gi');

    function decodeComponents(components, split) {
    	try {
    		// Try to decode the entire string first
    		return [decodeURIComponent(components.join(''))];
    	} catch (err) {
    		// Do nothing
    	}

    	if (components.length === 1) {
    		return components;
    	}

    	split = split || 1;

    	// Split the array in 2 parts
    	var left = components.slice(0, split);
    	var right = components.slice(split);

    	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
    }

    function decode(input) {
    	try {
    		return decodeURIComponent(input);
    	} catch (err) {
    		var tokens = input.match(singleMatcher) || [];

    		for (var i = 1; i < tokens.length; i++) {
    			input = decodeComponents(tokens, i).join('');

    			tokens = input.match(singleMatcher) || [];
    		}

    		return input;
    	}
    }

    function customDecodeURIComponent(input) {
    	// Keep track of all the replacements and prefill the map with the `BOM`
    	var replaceMap = {
    		'%FE%FF': '\uFFFD\uFFFD',
    		'%FF%FE': '\uFFFD\uFFFD'
    	};

    	var match = multiMatcher.exec(input);
    	while (match) {
    		try {
    			// Decode as big chunks as possible
    			replaceMap[match[0]] = decodeURIComponent(match[0]);
    		} catch (err) {
    			var result = decode(match[0]);

    			if (result !== match[0]) {
    				replaceMap[match[0]] = result;
    			}
    		}

    		match = multiMatcher.exec(input);
    	}

    	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
    	replaceMap['%C2'] = '\uFFFD';

    	var entries = Object.keys(replaceMap);

    	for (var i = 0; i < entries.length; i++) {
    		// Replace all decoded components
    		var key = entries[i];
    		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
    	}

    	return input;
    }

    var decodeUriComponent = function (encodedURI) {
    	if (typeof encodedURI !== 'string') {
    		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
    	}

    	try {
    		encodedURI = encodedURI.replace(/\+/g, ' ');

    		// Try the built in decoder first
    		return decodeURIComponent(encodedURI);
    	} catch (err) {
    		// Fallback to a more advanced decoder
    		return customDecodeURIComponent(encodedURI);
    	}
    };

    var splitOnFirst = (string, separator) => {
    	if (!(typeof string === 'string' && typeof separator === 'string')) {
    		throw new TypeError('Expected the arguments to be of type `string`');
    	}

    	if (separator === '') {
    		return [string];
    	}

    	const separatorIndex = string.indexOf(separator);

    	if (separatorIndex === -1) {
    		return [string];
    	}

    	return [
    		string.slice(0, separatorIndex),
    		string.slice(separatorIndex + separator.length)
    	];
    };

    var filterObj = function (obj, predicate) {
    	var ret = {};
    	var keys = Object.keys(obj);
    	var isArr = Array.isArray(predicate);

    	for (var i = 0; i < keys.length; i++) {
    		var key = keys[i];
    		var val = obj[key];

    		if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
    			ret[key] = val;
    		}
    	}

    	return ret;
    };

    (function (exports) {
    	const strictUriEncode$1 = strictUriEncode;
    	const decodeComponent = decodeUriComponent;
    	const splitOnFirst$1 = splitOnFirst;
    	const filterObject = filterObj;

    	const isNullOrUndefined = value => value === null || value === undefined;

    	function encoderForArrayFormat(options) {
    		switch (options.arrayFormat) {
    			case 'index':
    				return key => (result, value) => {
    					const index = result.length;

    					if (
    						value === undefined ||
    						(options.skipNull && value === null) ||
    						(options.skipEmptyString && value === '')
    					) {
    						return result;
    					}

    					if (value === null) {
    						return [...result, [encode(key, options), '[', index, ']'].join('')];
    					}

    					return [
    						...result,
    						[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
    					];
    				};

    			case 'bracket':
    				return key => (result, value) => {
    					if (
    						value === undefined ||
    						(options.skipNull && value === null) ||
    						(options.skipEmptyString && value === '')
    					) {
    						return result;
    					}

    					if (value === null) {
    						return [...result, [encode(key, options), '[]'].join('')];
    					}

    					return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
    				};

    			case 'comma':
    			case 'separator':
    				return key => (result, value) => {
    					if (value === null || value === undefined || value.length === 0) {
    						return result;
    					}

    					if (result.length === 0) {
    						return [[encode(key, options), '=', encode(value, options)].join('')];
    					}

    					return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
    				};

    			default:
    				return key => (result, value) => {
    					if (
    						value === undefined ||
    						(options.skipNull && value === null) ||
    						(options.skipEmptyString && value === '')
    					) {
    						return result;
    					}

    					if (value === null) {
    						return [...result, encode(key, options)];
    					}

    					return [...result, [encode(key, options), '=', encode(value, options)].join('')];
    				};
    		}
    	}

    	function parserForArrayFormat(options) {
    		let result;

    		switch (options.arrayFormat) {
    			case 'index':
    				return (key, value, accumulator) => {
    					result = /\[(\d*)\]$/.exec(key);

    					key = key.replace(/\[\d*\]$/, '');

    					if (!result) {
    						accumulator[key] = value;
    						return;
    					}

    					if (accumulator[key] === undefined) {
    						accumulator[key] = {};
    					}

    					accumulator[key][result[1]] = value;
    				};

    			case 'bracket':
    				return (key, value, accumulator) => {
    					result = /(\[\])$/.exec(key);
    					key = key.replace(/\[\]$/, '');

    					if (!result) {
    						accumulator[key] = value;
    						return;
    					}

    					if (accumulator[key] === undefined) {
    						accumulator[key] = [value];
    						return;
    					}

    					accumulator[key] = [].concat(accumulator[key], value);
    				};

    			case 'comma':
    			case 'separator':
    				return (key, value, accumulator) => {
    					const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
    					const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
    					value = isEncodedArray ? decode(value, options) : value;
    					const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
    					accumulator[key] = newValue;
    				};

    			default:
    				return (key, value, accumulator) => {
    					if (accumulator[key] === undefined) {
    						accumulator[key] = value;
    						return;
    					}

    					accumulator[key] = [].concat(accumulator[key], value);
    				};
    		}
    	}

    	function validateArrayFormatSeparator(value) {
    		if (typeof value !== 'string' || value.length !== 1) {
    			throw new TypeError('arrayFormatSeparator must be single character string');
    		}
    	}

    	function encode(value, options) {
    		if (options.encode) {
    			return options.strict ? strictUriEncode$1(value) : encodeURIComponent(value);
    		}

    		return value;
    	}

    	function decode(value, options) {
    		if (options.decode) {
    			return decodeComponent(value);
    		}

    		return value;
    	}

    	function keysSorter(input) {
    		if (Array.isArray(input)) {
    			return input.sort();
    		}

    		if (typeof input === 'object') {
    			return keysSorter(Object.keys(input))
    				.sort((a, b) => Number(a) - Number(b))
    				.map(key => input[key]);
    		}

    		return input;
    	}

    	function removeHash(input) {
    		const hashStart = input.indexOf('#');
    		if (hashStart !== -1) {
    			input = input.slice(0, hashStart);
    		}

    		return input;
    	}

    	function getHash(url) {
    		let hash = '';
    		const hashStart = url.indexOf('#');
    		if (hashStart !== -1) {
    			hash = url.slice(hashStart);
    		}

    		return hash;
    	}

    	function extract(input) {
    		input = removeHash(input);
    		const queryStart = input.indexOf('?');
    		if (queryStart === -1) {
    			return '';
    		}

    		return input.slice(queryStart + 1);
    	}

    	function parseValue(value, options) {
    		if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
    			value = Number(value);
    		} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
    			value = value.toLowerCase() === 'true';
    		}

    		return value;
    	}

    	function parse(query, options) {
    		options = Object.assign({
    			decode: true,
    			sort: true,
    			arrayFormat: 'none',
    			arrayFormatSeparator: ',',
    			parseNumbers: false,
    			parseBooleans: false
    		}, options);

    		validateArrayFormatSeparator(options.arrayFormatSeparator);

    		const formatter = parserForArrayFormat(options);

    		// Create an object with no prototype
    		const ret = Object.create(null);

    		if (typeof query !== 'string') {
    			return ret;
    		}

    		query = query.trim().replace(/^[?#&]/, '');

    		if (!query) {
    			return ret;
    		}

    		for (const param of query.split('&')) {
    			if (param === '') {
    				continue;
    			}

    			let [key, value] = splitOnFirst$1(options.decode ? param.replace(/\+/g, ' ') : param, '=');

    			// Missing `=` should be `null`:
    			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    			value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
    			formatter(decode(key, options), value, ret);
    		}

    		for (const key of Object.keys(ret)) {
    			const value = ret[key];
    			if (typeof value === 'object' && value !== null) {
    				for (const k of Object.keys(value)) {
    					value[k] = parseValue(value[k], options);
    				}
    			} else {
    				ret[key] = parseValue(value, options);
    			}
    		}

    		if (options.sort === false) {
    			return ret;
    		}

    		return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
    			const value = ret[key];
    			if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
    				// Sort object keys, not values
    				result[key] = keysSorter(value);
    			} else {
    				result[key] = value;
    			}

    			return result;
    		}, Object.create(null));
    	}

    	exports.extract = extract;
    	exports.parse = parse;

    	exports.stringify = (object, options) => {
    		if (!object) {
    			return '';
    		}

    		options = Object.assign({
    			encode: true,
    			strict: true,
    			arrayFormat: 'none',
    			arrayFormatSeparator: ','
    		}, options);

    		validateArrayFormatSeparator(options.arrayFormatSeparator);

    		const shouldFilter = key => (
    			(options.skipNull && isNullOrUndefined(object[key])) ||
    			(options.skipEmptyString && object[key] === '')
    		);

    		const formatter = encoderForArrayFormat(options);

    		const objectCopy = {};

    		for (const key of Object.keys(object)) {
    			if (!shouldFilter(key)) {
    				objectCopy[key] = object[key];
    			}
    		}

    		const keys = Object.keys(objectCopy);

    		if (options.sort !== false) {
    			keys.sort(options.sort);
    		}

    		return keys.map(key => {
    			const value = object[key];

    			if (value === undefined) {
    				return '';
    			}

    			if (value === null) {
    				return encode(key, options);
    			}

    			if (Array.isArray(value)) {
    				return value
    					.reduce(formatter(key), [])
    					.join('&');
    			}

    			return encode(key, options) + '=' + encode(value, options);
    		}).filter(x => x.length > 0).join('&');
    	};

    	exports.parseUrl = (url, options) => {
    		options = Object.assign({
    			decode: true
    		}, options);

    		const [url_, hash] = splitOnFirst$1(url, '#');

    		return Object.assign(
    			{
    				url: url_.split('?')[0] || '',
    				query: parse(extract(url), options)
    			},
    			options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
    		);
    	};

    	exports.stringifyUrl = (object, options) => {
    		options = Object.assign({
    			encode: true,
    			strict: true
    		}, options);

    		const url = removeHash(object.url).split('?')[0] || '';
    		const queryFromUrl = exports.extract(object.url);
    		const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

    		const query = Object.assign(parsedQueryFromUrl, object.query);
    		let queryString = exports.stringify(query, options);
    		if (queryString) {
    			queryString = `?${queryString}`;
    		}

    		let hash = getHash(object.url);
    		if (object.fragmentIdentifier) {
    			hash = `#${encode(object.fragmentIdentifier, options)}`;
    		}

    		return `${url}${queryString}${hash}`;
    	};

    	exports.pick = (input, filter, options) => {
    		options = Object.assign({
    			parseFragmentIdentifier: true
    		}, options);

    		const {url, query, fragmentIdentifier} = exports.parseUrl(input, options);
    		return exports.stringifyUrl({
    			url,
    			query: filterObject(query, filter),
    			fragmentIdentifier
    		}, options);
    	};

    	exports.exclude = (input, filter, options) => {
    		const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

    		return exports.pick(input, exclusionFilter, options);
    	}; 
    } (queryString));

    var I18 = /** @class */ (function () {
        function I18(options) {
            this.pack = options.pack;
            this.localeField = options.localeField || "locale";
            this.replace = options.replace || false;
            this.defaultLocale = options.defaultLocale || "zh";
            console.log(this);
            if (this.replace)
                this.DOMreplace();
        }
        I18.prototype.DOMreplace = function () {
            // text
            var textDOM = document.querySelectorAll("[i18-text]");
            console.log(textDOM);
        };
        I18.prototype.setLocale = function (locale) {
            var _a;
            var url = window.location.href.split("?")[0];
            var params = window.location.href.split("?")[1];
            var newParams = queryString.stringify(__assign(__assign({}, queryString.parse(params)), (_a = {}, _a[this.localeField] = locale, _a)));
            window.location.href = "".concat(url, "?").concat(newParams);
            localStorage.setItem(this.localeField, locale);
            window.location.reload();
        };
        I18.prototype.getLocale = function () {
            var _a;
            var params = window.location.href.split("?")[1];
            var locale = ((_a = queryString.parse(params)) === null || _a === void 0 ? void 0 : _a[this.localeField]) ||
                localStorage.getItem(this.localeField) ||
                this.defaultLocale;
            return locale;
        };
        /** 翻译 */
        I18.prototype.t = function (key, params) {
            var _a;
            var locale = this.getLocale();
            // @ts-ignore
            var result = (_a = this.pack[key]) === null || _a === void 0 ? void 0 : _a[locale];
            if (params) {
                Object.keys(params).forEach(function (paramsKey) {
                    result = result.replace("{".concat(paramsKey, "}"), params[paramsKey]);
                });
            }
            return result;
        };
        return I18;
    }());

    return I18;

}));
