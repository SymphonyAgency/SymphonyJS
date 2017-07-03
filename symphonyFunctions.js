/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	__webpack_require__(1);
	function SymphonyJs(options) {

	    //adds .name property to functions in old browsers
	    if (Function.prototype.name === undefined) {
	        // Add a custom property to all function values
	        // that actually invokes a method to get the value
	        Object.defineProperty(Function.prototype, 'name', {
	            get: function get() {
	                return (/function ([^(]*)/.exec(this + "")[1]
	                );
	            }
	        });
	    }

	    var SymphonyClass = __webpack_require__(2);
	    //Get references to all js files in extensions.
	    var context = __webpack_require__(3);

	    context.keys().map(function (extension) {

	        //runs require on the found path.
	        var ext = context(extension);

	        if ((typeof ext === 'undefined' ? 'undefined' : _typeof(ext)) === 'object') {
	            //add all keys(expected to be functions) as prototypes of the symphony
	            //class
	            for (var key in ext) {
	                if (ext[key] === 'function') SymphonyClass.prototype[key] = ext[key];
	            }
	        } else if (typeof ext === 'function' && ext.name !== '') {
	            SymphonyClass.prototype[ext.name] = ext;
	        } else {
	            console.error('File ' + extension + ' does not export a named function or object with keys as functions');
	        }
	    });

	    return new SymphonyClass(options);
	}

	window.SymphonyJs = SymphonyJs;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Polyfills for JavaScript functionality not replaced by Babel >.<
	 */

	module.exports = function () {

	  if (!Array.prototype.includes) {
	    Array.prototype.includes = function (searchElement /*, fromIndex*/) {
	      'use strict';

	      var O = Object(this);
	      var len = parseInt(O.length, 10) || 0;
	      if (len === 0) {
	        return false;
	      }
	      var n = parseInt(arguments[1], 10) || 0;
	      var k;
	      if (n >= 0) {
	        k = n;
	      } else {
	        k = len + n;
	        if (k < 0) {
	          k = 0;
	        }
	      }
	      var currentElement;
	      while (k < len) {
	        currentElement = O[k];
	        if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
	          // NaN !== NaN
	          return true;
	        }
	        k++;
	      }
	      return false;
	    };
	  }
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	module.exports = function () {
		/**
	  * Creates an instance of symphoniFunctions.
	  * 
	  * @param {any} optionsInput
	  */

		function symphoniFunctions(optionsInput) {
			var _this = this;

			_classCallCheck(this, symphoniFunctions);

			var options = optionsInput || {};
			var defaults = {
				$: jQuery,
				breakpointRanges: {
					xs: [0, 767],
					sm: [768, 991],
					md: [992, 1199],
					lg: [1200, 9999]
				},
				debug: false
			};
			this.logPrefix = ['%cSJS', "color:lightseagreen; font-size:1.3em"];
			this.debug = options.debug;
			this.logIsWithinGroup = 0;

			this.log('DEBUG IS ACTIVE');
			this.logGroup('Constructor');
			this.log('constructor started');

			this.options = options || {};
			this.options.resizethrottleMs = options.resizethrottleMS || 100;
			this.currentBreakpoint = null;
			this.breakpointRanges = options.breakpointRanges || defaults.breakpointRanges;
			this.readyQueue = [];
			this.loadQueue = [];
			this.resizeQueue = [];
			this.windowWidth = null;
			this.breakpointChanged = true;
			this.$ = options.$ || defaults.$;
			this.log('options:', this.options);

			//ready event
			document.addEventListener('DOMContentLoaded', function () {
				_this.logGroup("onReady");

				var _getBreakpoint = _this.getBreakpoint(_this.breakpointRanges, _this.currentBreakpoint);

				var breakpoint = _getBreakpoint.breakpoint;
				var windowWidth = _getBreakpoint.windowWidth;

				_this.currentBreakpoint = breakpoint;
				_this.windowWidth = windowWidth;
				_this.runActions(_this.readyQueue);
				_this.logGroupEnd();
			});

			// Browser events
			//replaced on ready
			// this.$(document).on('ready', () => {

			// })

			window.addEventListener('load', function () {
				_this.logGroup('onLoad');

				var _getBreakpoint2 = _this.getBreakpoint(_this.breakpointRanges, _this.currentBreakpoint);

				var breakpoint = _getBreakpoint2.breakpoint;
				var windowWidth = _getBreakpoint2.windowWidth;

				_this.currentBreakpoint = breakpoint;
				_this.windowWidth = windowWidth;
				_this.runActions(_this.loadQueue);
				_this.logGroupEnd();
			}, false);
			//removed jquery on load and replace with native javascript
			// this.$(window).on('load', () => {

			// })

			this.onResize(function () {
				_this.runResize(false);
			}, options.resizethrottleMS);
			this.logGroupEnd();
		}

		/**
	  * Created to allow a manual trigger for resize queue.  Will trigger breakpointchange if no param, or true.
	  */


		_createClass(symphoniFunctions, [{
			key: 'runResize',
			value: function runResize(triggerBreakPointChange) {
				var _getBreakpoint3 = this.getBreakpoint(this.breakpointRanges, this.currentBreakpoint);

				var breakpoint = _getBreakpoint3.breakpoint;
				var windowWidth = _getBreakpoint3.windowWidth;
				var breakpointChanged = _getBreakpoint3.breakpointChanged;

				breakpointChanged = triggerBreakPointChange === undefined || triggerBreakPointChange === true ? true : breakpointChanged;
				this.logGroup('onResize', breakpoint, windowWidth, breakpointChanged);
				this.currentBreakpoint = breakpoint;
				this.windowWidth = windowWidth;
				this.breakpointChanged = breakpointChanged;
				this.log('Breakpoint', this.currentBreakpoint, 'WindowWidth', this.windowWidth);
				this.runActions(this.resizeQueue);
				this.breakpointChanged = false; // reset state
				this.logGroupEnd();
			}
			/**
	   * 
	   * 
	   * @param {any} output
	   * @param {any} debug
	   */

		}, {
			key: 'log',
			value: function log(debug, output, callback) {
				var args = Array.prototype.slice.call(arguments);
				var prefix = void 0;
				if (this.logIsWithinGroup > 0) {
					prefix = [];
				} else {
					prefix = this.logPrefix;
				}
				if (this.debug === true && typeof debug === 'string') {
					var lastArg = args.slice(args.length - 1)[0];
					if (typeof lastArg === 'function') {
						var loggablArgs = args.slice(0, args.length - 1);
						console.log.apply(console, prefix.concat(loggablArgs));
						callback();
					} else {
						console.log.apply(console, prefix.concat(args));
					}
				} else if (this.debug !== false && (this.debug === true || debug === true) && debug !== false) {
					var _lastArg = args.slice(args.length - 1)[0];
					if (typeof _lastArg === 'function') {
						var _loggablArgs = args.slice(1, args.length - 1);
						console.log.apply(console, prefix.concat(_loggablArgs));
						callback();
					} else {
						var _loggablArgs2 = args.slice(1);
						console.log.apply(console, prefix.concat(_loggablArgs2));
					}
				}
			}
		}, {
			key: 'logGroup',
			value: function logGroup(debug, name) {
				var inputArgs = Array.prototype.slice.call(arguments);
				if (this.debug && typeof debug === 'string') {
					this.logIsWithinGroup += 1;
					console.groupCollapsed.apply(console, this.logPrefix.concat(inputArgs));
				} else if (this.debug !== false && (this.debug === true || debug === true) && debug !== false) {
					var logArgs = inputArgs.slice(1);
					this.logIsWithinGroup += 1;
					console.groupCollapsed.apply(console, this.logPrefix.concat(logArgs));
				}
			}
		}, {
			key: 'logGroupEnd',
			value: function logGroupEnd(debug) {
				if (this.debug !== false && (this.debug === true || debug === true) && debug !== false) this.logIsWithinGroup -= 1;
				console.groupEnd();
			}

			/**
	   * 
	   * 
	   * @param {any} actions
	   */

		}, {
			key: 'runActions',
			value: function runActions(actions) {
				var _this2 = this;

				this.logGroup('runActions()');
				actions.forEach(function (action) {
					_this2.log('Action: ', action.name, action);

					//Run if no breakpoints set
					//OR if the current breakpoint matches what is set.
					if (_this2.shouldRunOnBreakpoint(action)) {
						_this2.log('shouldRunOnBreakpoint passed', 'action.name: ' + action.name);
						//Run if onlyOnBreakpointChanged isn't set
						//OR if it is set and the breakpoint has changed.
						if (_this2.shouldRunOnlyOnBreakpointChanged(action)) {
							_this2.log('shouldRunOnlyOnBreakPointChange passed', 'action.name: ' + action.name);
							if (_this2.shouldRunOnce(action)) {
								action.runCount += 1;
								_this2.log('shouldRunOnce passed', 'action.name: ' + action.name);
								action.func.call(_this2, action.options);
							}
						}
						//FOR running the reset on off breakpoints
						//Run if rest function exists, and (breakpoints are set and it's not the current breakpoint)
					} else if (_this2.shouldRunReset(action)) {
						_this2.log('shouldRunReset passed', 'action.name: ' + action.name);
						action.runCount = 0;
						action.reset.call(_this2, action.options);
					}
				});
				this.logGroupEnd();
			}
		}, {
			key: 'shouldRunOnBreakpoint',
			value: function shouldRunOnBreakpoint(action) {
				var breakpointsDontExist = typeof action.options.breakpoints === 'undefined';
				var breakpointsMatchCurrent = action.options.breakpoints ? action.options.breakpoints.includes(this.currentBreakpoint) : false;

				return breakpointsDontExist || breakpointsMatchCurrent;
			}
		}, {
			key: 'shouldRunOnce',
			value: function shouldRunOnce(action) {
				var runOnce = action.options.runOnce === true;
				var runOnceNotSet = typeof action.options.runOnce === 'undefined';
				var hasNotRun = action.runCount === 0;
				return runOnceNotSet || runOnce && hasNotRun;
			}
		}, {
			key: 'shouldRunOnlyOnBreakpointChanged',
			value: function shouldRunOnlyOnBreakpointChanged(action) {
				var onlyOnChange = action.options.onlyOnBreakpointChanged;
				var onlyOnChangeNotSet = typeof action.options.onlyOnBreakpointChanged === 'undefined';
				return onlyOnChangeNotSet || onlyOnChange && this.breakpointChanged;
			}
		}, {
			key: 'shouldRunReset',
			value: function shouldRunReset(action) {
				var resetFunctionExists = typeof action.reset === 'function';
				var breakpointsExist = typeof action.options.breakpoints !== 'undefined';
				var breakpointsMatchCurrent = action.options.breakpoints ? action.options.breakpoints.includes(this.currentBreakpoint) : false;
				return resetFunctionExists && breakpointsExist && !breakpointsMatchCurrent && action.runCount > 0;
			}

			// Takes type as string, single parameter for process.
			/**
	   * 
	   * 
	   * @param {any} type
	   * @param {any} input
	   * @param {any} callback
	   */

		}, {
			key: 'processArrayOrType',
			value: function processArrayOrType(type, input, callback) {
				if (Array.isArray(input)) {
					input.forEach(function (options) {
						callback(options);
					});
				} else if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === type) {
					callback(input);
				} else if (!input) {
					callback(null);
				} else {
					console.error('Expecting Array or ' + type + '.  Received: ' + (typeof input === 'undefined' ? 'undefined' : _typeof(input)));
				}
			}

			/**
	   * 
	   * 
	   * @param {any} action
	   */

		}, {
			key: 'addToQueues',
			value: function addToQueues(action) {
				var _this3 = this;

				this.logGroup('addToQueues():', action.name, action);
				if (!action.options) action.options = {};
				action.runCount = 0;

				this.processArrayOrType('string', action.options.windowEvents, function (event) {
					switch (event) {
						case 'ready':
							_this3.log('Adding to Ready queue:', 'action.name: ' + action.name);
							_this3.readyQueue.push(action);
							break;
						case 'load':
							_this3.log('Adding to Load queue', 'action.name: ' + action.name);
							_this3.loadQueue.push(action);
							break;
						case 'resize':
							_this3.log('Adding to resize queue', 'action.name: ' + action.name);
							_this3.resizeQueue.push(action);
							break;
						default:
							_this3.readyQueue.push(action);
					}
				});
				this.logGroupEnd();
			}

			/**
	   * 
	   * 
	   * @param {any} targets
	   * @returns
	   */

		}, {
			key: 'domElementExists',
			value: function domElementExists(targets) {
				this.logGroup('domElementExists: ');
				this.log('targets:', targets);
				var dependenciesMet = true;
				//turns multiple parameters into an array for processArrayOrType
				if (arguments.length > 1) targets = arguments;

				this.processArrayOrType('string', targets, function (target) {
					if (target && document.querySelectorAll(target).length === 0) dependenciesMet = false;
				});
				this.logGroupEnd();
				return dependenciesMet;
			}

			/**
	   * Gets window width and breakpoint data
	   * 
	   * @param {Object} breakpointRanges - accepts object in the format of:
	        {
	  			xs: [0, 767],
	  			sm: [768, 991],
	  			md: [992, 1199],
	  			lg: [1200, 9999],
	  		}
	   * @param {string} currentBreakpoint - to tell if breakPointChanged
	   * @returns {Object}:
	   * 	{	
	   * 		breakpointChanged {boolean} - if breapoint different from currentBreakpoint
	   * 		breakpoint {string} - the found breakpoint
	   * 		windowWidth {number}
	   * 	}
	   */

		}, {
			key: 'getBreakpoint',
			value: function getBreakpoint(breakpointRanges, currentBreakpoint) {
				var windowWidth = window.innerWidth;
				var breakpointChanged = false;
				var breakpoint = null;
				Object.keys(breakpointRanges).forEach(function (range) {

					var breakpointWidths = breakpointRanges[range];

					if (windowWidth > breakpointWidths[0] && windowWidth <= breakpointWidths[1]) {
						if (range !== currentBreakpoint) breakpointChanged = true;
						breakpoint = range;
					}
				});
				return {
					breakpointChanged: breakpointChanged,
					breakpoint: breakpoint,
					windowWidth: windowWidth
				};
			}

			/**
	   * only calls resize one every 
	   * 
	   * @param {any} func - onResize function
	   * @param {number} milliseconds - time between calls
	   * @param {any} t - reference for timeout.  Leave out of call.
	   * @returns
	   */

		}, {
			key: 'onResize',
			value: function onResize(func, milliseconds) {
				var timeout = void 0;
				window.addEventListener('resize', function () {
					if (!timeout) {
						timeout = setTimeout(function () {
							timeout = null;
							func();
						}, milliseconds);
					}
				});
			}
		}]);

		return symphoniFunctions;
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./custom.js": 4,
		"./equalizeHeights.js": 5,
		"./equalizeSides.js": 6,
		"./resizeSwap.js": 7,
		"./toggle.js": 8
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 3;


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function custom(input, _func, _reset) {
		var _this = this;

		this.logGroup(input.debug, "custom() setup");
		this.processArrayOrType('object', input, function (options) {
			//defaults
			options.windowEvents = options.windowEvents || 'load';

			if (_this.domElementExists(options.dependency)) {
				_this.log(input.debug, "adding to queues");

				_this.addToQueues({
					func: function func(opts) {
						_this.logGroup(input.debug, 'Custom() run');
						_func(opts);
						_this.logGroupEnd(input.debug);
					},
					options: options,
					reset: function reset(opts) {
						_this.logGroup(input.debug, 'Custom() reset');
						_reset(opts);
						_this.logGroupEnd(input.debug);
					},
					name: 'custom'
				});
			}
		});
		this.logGroupEnd(input.debug);
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function equalizeHeights(input) {
		var _this = this;

		this.logGroup(input.debug, 'equalizeHeights setup');
		this.processArrayOrType('object', input, function (options) {
			//defaults
			options.windowEvents = options.windowEvents || ['resize', 'load'];

			if (_this.domElementExists([options.selector, options.dependency])) {
				_this.log(options.debug, "equalizeHeights: selector and/or dependency found");
				_this.addToQueues({
					func: equalizeHeightsRun,
					options: options,
					reset: reset,
					name: 'equalizeHeights'
				});
			} else {
				_this.log(options.debug, "equalizeHeights: selector and/or dependency not found");
			}
		});
		this.logGroupEnd(input.debug);
	};

	function equalizeHeightsRun(options) {
		this.logGroup(options.debug, 'equalizeHeights() run');
		console.log('equalizeHeights running');
		var columns = document.querySelectorAll(options.selector);
		this.log(options.debug, "equalizeHeights: ", options.selector, " found ", columns.length);
		var countOfColumns = [];
		var heightsOfColumns = [];

		for (var i = 0; i < columns.length; i++) {
			countOfColumns.push(0);
		}countOfColumns.forEach.call(columns, function (el, index, arr) {
			arr[index].style.height = "auto";
			heightsOfColumns.push([el, arr[index].clientHeight]);
		});

		heightsOfColumns.sort(function (a, b) {
			return b[1] - a[1];
		});

		for (var column in columns) {
			if (column < columns.length) {
				for (var col in heightsOfColumns) {
					if (heightsOfColumns[col][0] === columns[column]) {
						columns[column].style.height = heightsOfColumns[col][1] + "px";
					}
				}
				columns[column].style.height = heightsOfColumns[0][1] + "px";
			}
		}

		this.logGroupEnd(options.debug);
	}

	function reset(options) {
		this.logGroup(options.debug, 'equalizeHeights reset');
		var columns = document.querySelectorAll(options.selector);

		for (var column in columns) {
			if (column < columns.length) //necessary???
				columns[column].style.height = '';
		}this.logGroupEnd(options.debug);
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function equalizeSides(input) {
	    var _this = this;

	    this.logGroup(input.debug, 'equalizeSides() setup');
	    this.processArrayOrType('object', input, function (options) {
	        options.windowEvents = options.windowEvents || ['resize', 'load'];
	        if (_this.domElementExists(options.target, options.source, options.dependency)) {
	            _this.log(input.debug, 'dependencies exist');
	            _this.addToQueues({
	                func: equalizeSidesRun,
	                options: options,
	                reset: resetSides,
	                name: 'equalizeSides'
	            });
	        }
	    });
	    this.logGroupEnd(input.debug);
	};

	function equalizeSidesRun(options) {
	    var _this2 = this;

	    this.logGroup(options.debug, 'equalizeSides() run');
	    var targetList = void 0;
	    var source = void 0;
	    var sourceOffset = void 0;
	    var targetOffset = void 0;
	    var targetWidth = void 0;
	    var sourcePaddingLeft = void 0;
	    var sourcePaddingRight = void 0;
	    var targetProperty = void 0;
	    var sourceWidth = void 0;
	    var documentWidth = void 0;

	    //validation:
	    if (!options.source) return console.error('equalizeSides() requires a source');
	    if (!options.target) return console.error('equalizeSides() requires a target');
	    if (options.spacingProperty === 'width' && options.direction === 'left' || options.spacingProperty === 'widthPadding' && options.direction === 'left' || options.spacingProperty === 'marginPadding' && options.direction === 'left') return console.error('width can only be used with right direction');

	    //default options
	    options = {
	        target: options.target,
	        source: options.source,
	        direction: options.direction || 'left',
	        spacingProperty: options.spacingProperty || 'margin'
	    };
	    this.log('Options determined: ', options);

	    //get dom elements
	    targetList = jQuery(options.target);
	    if (targetList.length === 0) return this.log('Target not found ' + options.target);
	    this.log('target items found ' + targetList.length + ':', targetList);
	    source = jQuery(options.source).first();
	    if (source.length === 0) return this.log('Log not found ' + source);

	    targetList.each(function (index) {
	        var target = jQuery(targetList[index]);
	        _this2.log('Running on index ' + index + ' of found items', target);
	        //construct the target spacing property.
	        if (options.spacingProperty === 'left' || options.spacingProperty === 'right') {
	            targetProperty = options.spacingProperty;
	        } else if (options.spacingProperty === 'margin' || options.spacingProperty === 'margin' || options.spacingProperty === 'padding') {
	            targetProperty = options.spacingProperty + '-' + options.direction;
	        } else if (options.spacingProperty === 'width') {
	            targetProperty = options.spacingProperty;
	        } else if (options.spacingProperty === 'marginPadding' || options.spacingProperty === 'widthPadding') {
	            targetProperty = options.spacingProperty;
	        } else {
	            return console.error('equalizeSides() accepts target spacingProperty of: padding, margin, left, right, and width');
	        }
	        _this2.log('spacingProperty determined: ' + targetProperty);

	        //left or right handling.
	        if (options.direction === 'left') {
	            _this2.log('modifying left side');
	            sourceOffset = source.offset().left;
	            sourcePaddingLeft = parseInt(source.css('padding-left'));
	            target.css(targetProperty, sourceOffset + sourcePaddingLeft);
	            _this2.log('Left CSS modifications added. Total offset: ' + (sourceOffset + sourcePaddingLeft));
	        } else if (options.direction === 'right') {
	            _this2.log('modifying right side');
	            sourcePaddingRight = parseInt(source.css('padding-right'));
	            sourceOffset = source.offset().left;
	            targetOffset = target.offset().left;
	            sourceWidth = source.outerWidth();
	            targetWidth = target.outerWidth();
	            documentWidth = jQuery(document).width();
	            var sourceToRight = documentWidth - (sourceOffset + sourceWidth);
	            var targetToRight = documentWidth - (targetOffset + targetWidth);

	            if (targetProperty === 'margin-right') {
	                _this2.log('margin-right added');
	                target.css(targetProperty, sourceToRight);
	            } else if (targetProperty === 'padding-right') {
	                target.css(targetProperty, sourceToRight + sourcePaddingRight);
	                _this2.log('padding-right added');
	            } else if (targetProperty === 'width') {
	                target.css(targetProperty, targetWidth + (targetToRight - sourceToRight));
	                _this2.log('width added');
	            } else if (targetProperty === 'widthPadding') {
	                target.css('width', targetWidth + (targetToRight - sourceToRight));
	                target.css('padding-right', sourcePaddingRight);
	                _this2.log('width and padding-right added');
	            } else if (targetProperty === 'marginPadding') {
	                target.css('margin-right', sourceToRight);
	                target.css('padding-right', sourcePaddingRight);
	                _this2.log('margin-right and padding-right added');
	            } else {
	                return console.error('equalizeSides() hopefully unreachable error in right side properties');
	            }
	        }
	    });

	    this.logGroupEnd(options.debug);
	}

	//TODO
	function resetSides(options) {
	    var _this3 = this;

	    this.logGroup(options.debug, 'equalizeSides() reset');
	    var targetList = void 0;
	    var source = void 0;
	    var sourceOffset = void 0;
	    var targetOffset = void 0;
	    var targetWidth = void 0;
	    var sourcePaddingLeft = void 0;
	    var sourcePaddingRight = void 0;
	    var targetProperty = void 0;
	    var sourceWidth = void 0;
	    var documentWidth = void 0;

	    //validation:
	    if (!options.source) return console.error('equalizeSides() requires a source');
	    if (!options.target) return console.error('equalizeSides() requires a target');
	    if (options.spacingProperty === 'width' && options.direction === 'left' || options.spacingProperty === 'widthPadding' && options.direction === 'left' || options.spacingProperty === 'marginPadding' && options.direction === 'left') return console.error('width can only be used with right direction');

	    //default options
	    options = {
	        target: options.target,
	        source: options.source,
	        direction: options.direction || 'left',
	        spacingProperty: options.spacingProperty || 'margin'
	    };

	    //get dom elements
	    targetList = jQuery(options.target);
	    if (targetList.length === 0) return this.log('Target not found ' + options.target);
	    this.log('target items found ' + targetList.length + ':', targetList);
	    source = jQuery(options.source).first();
	    if (source.length === 0) return this.log('Log not found ' + source);

	    targetList.each(function (index) {
	        var target = jQuery(targetList[index]);
	        _this3.log('Running on index ' + index + ' of found items', target);
	        //construct the target spacing property.
	        if (options.spacingProperty === 'left' || options.spacingProperty === 'right') {
	            targetProperty = options.spacingProperty;
	        } else if (options.spacingProperty === 'margin' || options.spacingProperty === 'margin' || options.spacingProperty === 'padding') {
	            targetProperty = options.spacingProperty + '-' + options.direction;
	        } else if (options.spacingProperty === 'width') {
	            targetProperty = options.spacingProperty;
	        } else if (options.spacingProperty === 'marginPadding' || options.spacingProperty === 'widthPadding') {
	            targetProperty = options.spacingProperty;
	        } else {
	            return console.error('equalizeSides() accepts target spacingProperty of: padding, margin, left, right, and width');
	        }

	        //left or right handling.
	        if (options.direction === 'left') {

	            target.css(targetProperty, '');
	        } else if (options.direction === 'right') {

	            if (targetProperty === 'margin-right') {
	                target.css(targetProperty, '');
	            } else if (targetProperty === 'padding-right') {
	                target.css(targetProperty, '');
	            } else if (targetProperty === 'width') {
	                target.css(targetProperty, '');
	            } else if (targetProperty === 'widthPadding') {
	                target.css('width', '');
	                target.css('padding-right', '');
	            } else if (targetProperty === 'marginPadding') {
	                target.css('margin-right', '');
	                target.css('padding-right', '');
	            } else {
	                return console.error('equalizeSides() hopefully unreachable error in right side properties');
	            }
	            _this3.log('Reset successful');
	        }
	    });

	    this.logGroupEnd(options.debug);
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	// module.exports = function resizeSwap(input) {
	// 	this.logGroup(input.debug, 'swap() setup')
	// 	this.processArrayOrType('object', input, (options) => {
	// 		//defaults
	// 		options.windowEvents = options.windowEvents || ['resize', 'load', 'ready']
	// 		options.runOnce = options.runOnce || true
	// 		if (this.domElementExists([options.selector, options.dependency])) {
	// 			this.log(options.debug, "selector and/or dependency found")
	// 			this.addToQueues({
	// 				func: resizeSwapRun,
	// 				options: options,
	// 				reset: reset,
	// 				name: 'resizeSwap'
	// 			})
	// 		} else {
	// 			this.log(options.debug, "selector and/or dependency not found")
	// 		}
	// 	})
	// 	this.logGroupEnd(input.debug)
	// }

	// function resizeSwapRun(options) {
	// 	this.logGroup(options.debug, 'swap() run')
	// 	console.log('swap() running')
	// 	let columns = document.querySelectorAll(options.selector)
	// 	this.log(options.debug, "swap: ", options.selector, " found ", columns.length)
	// 	var countOfColumns = []
	// 	var heightsOfColumns = []

	// 	for (var i = 0; i < columns.length; i++)
	// 		countOfColumns.push(0)

	// 	countOfColumns.forEach.call(columns, function (c, i, a) {
	// 		a[i].style.height = "auto"
	// 		heightsOfColumns.push([c, a[i].clientHeight])
	// 	})

	// 	heightsOfColumns.sort(function (a, b) {
	// 		return b[1] - a[1]
	// 	})

	// 	for (var column in columns)
	// 		if (column < columns.length)//necessary???
	// 			columns[column].style.height = heightsOfColumns[0][1] + "px"

	// 	this.logGroupEnd(options.debug)
	// }

	// function reset(options) {
	// 	this.logGroup(options.debug, 'swap reset')
	// 	let columns = document.querySelectorAll(options.selector)

	// 	for (var column in columns)
	// 		if (column < columns.length)//necessary???
	// 			columns[column].style.height = ''

	// 	this.logGroupEnd(options.debug)
	// }
	"use strict";

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function toggle(input) {
		var _this = this;

		this.logGroup(input.debug, "toggle() setup");
		this.processArrayOrType('object', input, function (options) {
			//defaults
			options.windowEvents = options.windowEvents || ['ready'];
			options.display = options.display || null;
			options.visibility = options.visibility || null;
			if (!options.display && !options.visibility) options.display = 'block';

			if (_this.domElementExists([options.button, options.target])) {
				_this.addToQueues({
					func: toggleRun,
					options: options,
					reset: toggleReset,
					name: 'toggle'
				});
			}
		});
		this.logGroupEnd(input.debug);
	};

	function toggleRun(options) {
		this.logGroup(options.debug, 'toggle() run');
		var button = this.$(options.button);
		var target = this.$(options.target);
		var $ = this.$;

		if (options.display) {

			button.on('click', function () {

				target.each(function () {
					var element = $(this);
					if (element.css('display') === 'none') {
						element.css('display', options.display);
					} else {
						element.css('display', 'none');
					}
				});
			});
		} else if (options.visibility) {
			button.on('click', function () {
				target.each(function () {
					if (this.css('visibility') === 'hidden') {
						this.css('visibility', options.visibility);
					} else {
						this.css('visibility', 'hidden');
					}
				});
			});
		} else {
			console.warn('SymphonyJs.toggle() both display and visibility are not set.  Shouldnt happen');
		}
		this.logGroupEnd(options.debug);
	}

	function toggleReset(options) {
		this.logGroup(options.debug, 'toggle() run');
		var button = this.$(options.button);
		var target = this.$(options.target);

		button.off('click');
		target.each(function () {
			this.removeAttribute('style');
		});
		this.logGroupEnd(options.debug);
	}

/***/ }
/******/ ]);