/**
 * Class instance created in src/index.js.  Contains all queues and other utilities
 * for managing action function extensions found in src/extensions.  Extensions are
 * added as prototypes to this class.
 */
export default class SymphonyFunctions {


    constructor(options) {
        if(!options) options = {}
        this.resizethrottleMs = 100;
        this.currentBreakpoint = null;
        this.breakpointRanges = {
            xs: [0, 767],
            sm: [768, 991],
            md: [992, 1199],
            lg: [1200, 9999],
        };
        this.readyQueue = [];
        this.loadQueue = [];
        this.resizeQueue = [];
        this.windowWidth = null;
        this.breakpointChanged = true;
        this.$ = null;

        this.setOptions(options)
        this.initializeListeners()
    }

    setOptions(options) {
        this.resizethrottleMs = options.resizethrottleMs || this.resizethrottleMs
        this.breakpointRanges = options.breakpointRanges || this.breakpointRanges
        this.$ = options.$ || window.jQuery || window.$
    }

    initializeListeners() {
        //On Ready
        document.addEventListener('DOMContentLoaded', () => {
            this.getBreakpoint()
            this.runActions(this.readyQueue)
        })

        //On Load
        window.addEventListener('load', () => {
            this.getBreakpoint()
            this.runActions(this.loadQueue)
        }, false)

        //On Resize - runResize abstracted out so that it can be run manually and be throttled.
        this.onResize(() => {
            this.runResize()
        }, this.resizethrottleMs)
    }

    /**
     * Created to allow a manual trigger for resize queue.  Will trigger breakpointchange if no param, or true.
     */
    runResize() {
        this.getBreakpoint()
        this.runActions(this.resizeQueue)
        this.breakpointChanged = false // reset state
    }

    /**
     * Conditionally runs all actions within a given queue based on the action's options.
     * @actions { object[] } - array of action objects.
     */
    runActions(actions) {
        actions.forEach((action) => {
            let shouldRun = (
                this.shouldRunOnBreakpoint(action)
                && this.shouldRunOnlyOnBreakpointChanged(action)
                && this.shouldRunOnce(action)
            )
            let shoudRunReset = this.shouldRunReset(action)

            if (shouldRun) {
                action.runCount += 1
                action.func.call(this, action.options)
            } else if (shoudRunReset) {
                action.runCount = 0
                action.reset.call(this, action.options)
            }
        })
    }

    //determines if action should run on the current breakpoint
    shouldRunOnBreakpoint(action) {
        let breakpointsDontExist = (typeof action.options.breakpoints === 'undefined')
        let ActionBreakpointsContainCurrent = action.options.breakpoints.includes(this.currentBreakpoint)
        let breakpointsMatchCurrent = (action.options.breakpoints ? ActionBreakpointsContainCurrent : false)

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
        if (!action.options) action.options = {}
        action.runCount = 0

        this.processArrayOrType('string', action.options.windowEvents, (event) => {
            switch (event) {
                case 'ready':
                    this.readyQueue.push(action)
                    break
                case 'load':
                    this.loadQueue.push(action)
                    break
                case 'resize':
                    this.resizeQueue.push(action)
                    break
                default:
                    this.readyQueue.push(action)
            }
        })
    }

    /**
     *
     *
     * @param {any} targets
     * @returns
     */
    domElementExists(targets) {
        let dependenciesMet = true
        //turns multiple parameters into an array for processArrayOrType
        if (arguments.length > 1) targets = arguments

        this.processArrayOrType('string', targets, (target) => {
            if (target && document.querySelectorAll(target).length === 0) dependenciesMet = false
        })
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
     *    {
	 * 		breakpointChanged {boolean} - if breapoint different from currentBreakpoint
	 * 		breakpoint {string} - the found breakpoint
	 * 		windowWidth {number}
	 * 	}
     */
    getBreakpoint() {

        this.windowWidth = window.innerWidth
        // this.breakpointChanged = false
        let breakpoint = null

        Object.keys(this.breakpointRanges).forEach((range) => {

            let breakpointWidths = this.breakpointRanges[range]

            if (this.windowWidth > breakpointWidths[0] && this.windowWidth <= breakpointWidths[1]) {
                if (range !== this.currentBreakpoint) this.breakpointChanged = true
                this.currentBreakpoint = range
            }
        })

        return {
            breakpointChanged: this.breakpointChanged,
            breakpoint,
            windowWidth: this.windowWidth
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

    /**
     *
     * @param func
     */
    use(func) {

        this.prototype[func.name] = func
    }
}
