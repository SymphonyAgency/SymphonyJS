
/**
 * Class instance created in src/index.js.  Contains all queues and other utilities
 * for managing action function extensions found in src/extensions.  Extensions are 
 * added as prototypes to this class.
 */
export default class SymphonyFunctions {
	/**
	 * Creates an instance of symphoniFunctions.
	 * 
	 * @param {Object} optionsInput - initializing options for the class 
	 */
	constructor(optionsInput) {

		const options = optionsInput || {}
		//class options defaults
		const defaults = {
			$: jQuery,
			breakpointRanges: {
				xs: [0, 767],
				sm: [768, 991],
				md: [992, 1199],
				lg: [1200, 9999],
			},
			debug: false,
		}
		//prefix used in log() and logGroup() to colorize and identify logging
		//from this library.
		this.logPrefix = ['%cSJS', "color:lightseagreen; font-size:1.3em"]

		this.debug = options.debug
		//keeps track of how nested the log groups are.  Main purpose is to added
		//the prefix to normal log() functions if not nested in a group.
		this.logIsWithinGroup = 0

		this.log('DEBUG IS ACTIVE')
		this.logGroup('Constructor')
		this.log('constructor started')
		

		this.options = options || {}
		this.options.resizethrottleMs = options.resizethrottleMS || 100
		this.currentBreakpoint = null
		this.breakpointRanges = options.breakpointRanges || defaults.breakpointRanges
		this.readyQueue = []
		this.loadQueue = []
		this.resizeQueue = []
		this.windowWidth = null
		this.breakpointChanged = true
		this.$ = options.$ || defaults.$
		this.log('options:', this.options)


		//Browser events that trigger event queues

		//On Ready
		document.addEventListener('DOMContentLoaded', ()=>{
this.logGroup("onReady")
			let { breakpoint, windowWidth } = this.getBreakpoint(this.breakpointRanges, this.currentBreakpoint)
			this.currentBreakpoint = breakpoint
			this.windowWidth = windowWidth
			this.runActions(this.readyQueue)
			this.logGroupEnd()
		})
		
		//On Load
		window.addEventListener('load', ()=>{
this.logGroup('onLoad')
			let { breakpoint, windowWidth } = this.getBreakpoint(this.breakpointRanges, this.currentBreakpoint)
			this.currentBreakpoint = breakpoint
			this.windowWidth = windowWidth
			this.runActions(this.loadQueue)
			this.logGroupEnd()

		}, false)

		//On Resize - runResize abstracted out so that it can be run manually and be throttled.
		this.onResize(() => {
			this.runResize(false)
		}, options.resizethrottleMS)
		this.logGroupEnd()
	}

	/**
	 * Created to allow a manual trigger for resize queue.  Will trigger breakpointchange if no param, or true.
	 */
	runResize(triggerBreakPointChange){

		let { breakpoint, windowWidth, breakpointChanged } = this.getBreakpoint(this.breakpointRanges, this.currentBreakpoint)
			breakpointChanged = (triggerBreakPointChange === undefined || triggerBreakPointChange === true) ? true : breakpointChanged;
			this.logGroup('onResize', breakpoint, windowWidth, breakpointChanged)
			this.currentBreakpoint = breakpoint
			this.windowWidth = windowWidth
			this.breakpointChanged = breakpointChanged
			this.log( 'Breakpoint',this.currentBreakpoint,'WindowWidth', this.windowWidth)
			this.runActions(this.resizeQueue)
			this.breakpointChanged = false // reset state
			this.logGroupEnd()
	}
	/**
	 * Adds pretty logging functionality to the class and prototypes.
	 * Rules within this class:
	 * debug {Not boolean} - first logged property.  If not boolean, it's interpreted as first output.
	 * output {any} - ...multiple parameters, and primary logging output.
	 * callback {function} - if last parameter is a function, it will be treated as a callback;
	 * 
	 * Rules within extension prototypes:
	 * debug {boolean} should be linked with the options input of the extension.
	 *     Relies on prototype's options and overrides classe's debug option (unless it's false)
	 * 
	 */
	log(debug, output, callback) {
		let args = Array.prototype.slice.call(arguments)
		let prefix
		if(this.logIsWithinGroup > 0){
			prefix = []
		}else{
			prefix = this.logPrefix
		}
		if (this.debug === true && typeof debug === 'string') {
			let lastArg = args.slice(args.length - 1)[0]
			if (typeof lastArg === 'function') {
				let loggablArgs = args.slice(0, args.length - 1)
				console.log.apply(console, prefix.concat(loggablArgs))
				callback()
			} else {
				console.log.apply(console, prefix.concat(args))
			}
		} else if (this.debug !== false && (this.debug === true || debug === true) && debug !== false) {
			let lastArg = args.slice(args.length - 1)[0]
			if (typeof lastArg === 'function') {
				let loggablArgs = args.slice(1, args.length - 1)
				console.log.apply(console, prefix.concat(loggablArgs))
				callback()
			} else {
				let loggablArgs = args.slice(1)
				console.log.apply(console, prefix.concat(loggablArgs))
			}
		}
	}
	
	/**
	 * Created heirarchical log groups.  Wrap desired function scopes with logGroup() and logGroupEnd().
	 * @debug {boolean} same usage as log() see above.
	 * @name {string} adds a desired label to the styled prefix to quickly identify groups.
	 */
	logGroup(debug, name) {
		let inputArgs = Array.prototype.slice.call(arguments)
		if (this.debug && typeof debug === 'string') {
			this.logIsWithinGroup += 1
			console.groupCollapsed.apply(console, this.logPrefix.concat(inputArgs))
		} else if (this.debug !== false && (this.debug === true || debug === true) && debug !== false) {
			let logArgs = inputArgs.slice(1)
			this.logIsWithinGroup += 1
			console.groupCollapsed.apply(console, this.logPrefix.concat(logArgs))
		}
	}

	//See logGroup()
	logGroupEnd(debug) {
		if (this.debug !== false && (this.debug === true || debug === true) && debug !== false)
		this.logIsWithinGroup -= 1
			console.groupEnd()
	}

	/**
	 * Conditionally runs all actions within a given queue based on the action's options.
	 * @actions { object[] } - array of action objects.
	 */
	runActions(actions) {
		this.logGroup('runActions()')
		actions.forEach((action) => {
			this.log('Action: ', action.name, action)

			//Run if no breakpoints set
			//OR if the current breakpoint matches what is set.
			if (this.shouldRunOnBreakpoint(action)) {
				this.log('shouldRunOnBreakpoint passed', 'action.name: ' + action.name)
				//Run if onlyOnBreakpointChanged isn't set
				//OR if it is set and the breakpoint has changed.
				if (this.shouldRunOnlyOnBreakpointChanged(action)) {
					this.log('shouldRunOnlyOnBreakPointChange passed', 'action.name: ' + action.name)
					if (this.shouldRunOnce(action)) {
						action.runCount += 1
						this.log('shouldRunOnce passed', 'action.name: ' + action.name)
						action.func.call(this, action.options)
					}

				}
				//FOR running the reset on off breakpoints
				//Run if rest function exists, and (breakpoints are set and it's not the current breakpoint)
			} else if (this.shouldRunReset(action)) {
				this.log('shouldRunReset passed', 'action.name: ' + action.name)
					action.runCount = 0
					action.reset.call(this, action.options)
			}
		})

		this.logGroupEnd()
	}
	//determines if action should run on the current breakpoint
	shouldRunOnBreakpoint(action) {
		let breakpointsDontExist = (typeof action.options.breakpoints === 'undefined')
		let breakpointsMatchCurrent = (action.options.breakpoints ? action.options.breakpoints.includes(this.currentBreakpoint) : false)

		return breakpointsDontExist || breakpointsMatchCurrent
	}

	//determines if action should run based on runOnce option.
	shouldRunOnce(action) {
		let runOnce = (action.options.runOnce === true)
		let runOnceNotSet = (typeof action.options.runOnce === 'undefined')
		let hasNotRun = (action.runCount === 0)
		return (runOnceNotSet || (runOnce && hasNotRun))
	}
	//determines if action should run based on onlyOnBreakpointChanged
	shouldRunOnlyOnBreakpointChanged(action) {
		let onlyOnChange = action.options.onlyOnBreakpointChanged
		let onlyOnChangeNotSet = (typeof action.options.onlyOnBreakpointChanged === 'undefined')
		return (onlyOnChangeNotSet || (onlyOnChange && this.breakpointChanged))
	}
	//determines if action's reset function should be run
	shouldRunReset(action) {
		let resetFunctionExists = (typeof action.reset === 'function')
		let breakpointsExist = (typeof action.options.breakpoints !== 'undefined')
		let breakpointsMatchCurrent = (action.options.breakpoints ? action.options.breakpoints.includes(this.currentBreakpoint) : false)
		return (resetFunctionExists && breakpointsExist &&
			!breakpointsMatchCurrent && action.runCount > 0)
	}

	// Takes type as string, single parameter for process.
	/**
	 * 
	 * 
	 * @param {any} type
	 * @param {any} input
	 * @param {any} callback
	 */
	processArrayOrType(type, input, callback) {
		if (Array.isArray(input)) {
			input.forEach((options) => {
				callback(options)
			})
		} else if (typeof input === type) {
			callback(input)
		} else if (!input) {
			callback(null)
		} else {
			console.error(`Expecting Array or ${type}.  Received: ${typeof input}`)
		}
	}

	/**
	 * 
	 * 
	 * @param {any} action
	 */
	addToQueues(action) {
		this.logGroup('addToQueues():', action.name, action)
		if (!action.options) action.options = {}
		action.runCount = 0

		this.processArrayOrType('string', action.options.windowEvents, (event) => {
			switch (event) {
				case 'ready':
					this.log('Adding to Ready queue:', 'action.name: ' + action.name)
					this.readyQueue.push(action)
					break
				case 'load':
					this.log('Adding to Load queue', 'action.name: ' + action.name)
					this.loadQueue.push(action)
					break
				case 'resize':
					this.log('Adding to resize queue', 'action.name: ' + action.name)
					this.resizeQueue.push(action)
					break
				default:
					this.readyQueue.push(action)
			}
		})
		this.logGroupEnd()
	}

	/**
	 * 
	 * 
	 * @param {any} targets
	 * @returns
	 */
	domElementExists(targets) {
		this.logGroup('domElementExists: ')
		this.log('targets:', targets)
		let dependenciesMet = true
		//turns multiple parameters into an array for processArrayOrType
		if (arguments.length > 1) targets = arguments

		this.processArrayOrType('string', targets, (target) => {
			if (target && document.querySelectorAll(target).length === 0) dependenciesMet = false
		})
		this.logGroupEnd()
		return dependenciesMet
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
	getBreakpoint(breakpointRanges, currentBreakpoint) {
		let windowWidth = window.innerWidth
		let breakpointChanged = false
		let breakpoint = null
		Object.keys(breakpointRanges).forEach((range) => {

			let breakpointWidths = breakpointRanges[range]

			if (windowWidth > breakpointWidths[0] && windowWidth <= breakpointWidths[1]) {
				if (range !== currentBreakpoint) breakpointChanged = true
				breakpoint = range
			}
		})
		return {
			breakpointChanged,
			breakpoint,
			windowWidth
		}
	}

	/**
	 * only calls resize one every 
	 * 
	 * @param {any} func - onResize function
	 * @param {number} milliseconds - time between calls
	 * @param {any} t - reference for timeout.  Leave out of call.
	 * @returns
	 */
	onResize(func, milliseconds) {
		let timeout
		window.addEventListener('resize', () => {
			if (!timeout) {
				timeout = setTimeout(() => {
					timeout = null
					func()
				}, milliseconds)
			}
		})
	}
}
