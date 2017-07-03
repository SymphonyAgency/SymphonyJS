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