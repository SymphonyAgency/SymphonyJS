export default function equalizeHeights(input) {
	this.logGroup(input.debug, 'equalizeHeights setup')
	this.processArrayOrType('object', input, (options) => {
		//defaults
		options.windowEvents = options.windowEvents || ['resize', 'load']

		if (this.domElementExists([options.selector, options.dependency])) {
			this.log(options.debug, "equalizeHeights: selector and/or dependency found")
			this.addToQueues({
				func: equalizeHeightsRun,
				options: options,
				reset: reset,
				name: 'equalizeHeights'
			})
		} else {
			this.log(options.debug, "equalizeHeights: selector and/or dependency not found")
		}
	})
	this.logGroupEnd(input.debug)
}

function equalizeHeightsRun(options) {
	this.logGroup(options.debug, 'equalizeHeights() run')
	console.log('equalizeHeights running')
	let columns = document.querySelectorAll(options.selector)
	this.log(options.debug, "equalizeHeights: ", options.selector, " found ", columns.length)
	var countOfColumns = []
	var heightsOfColumns = []

	for (var i = 0; i < columns.length; i++)
		countOfColumns.push(0)

	countOfColumns.forEach.call(columns, function (el, index, arr) {
		arr[index].style.height = "auto"
		heightsOfColumns.push([el, arr[index].clientHeight])
	})

	heightsOfColumns.sort(function (a, b) {
		return b[1] - a[1]
	})

	for (var column in columns) {
		if (column < columns.length) {
			for (var col in heightsOfColumns) {
				if (heightsOfColumns[col][0] === columns[column]) {
					columns[column].style.height = heightsOfColumns[col][1] + "px"
				}
			}
			columns[column].style.height = heightsOfColumns[0][1] + "px"
		}

	}


	this.logGroupEnd(options.debug)
}

function reset(options) {
	this.logGroup(options.debug, 'equalizeHeights reset')
	let columns = document.querySelectorAll(options.selector)

	for (var column in columns)
		if (column < columns.length)//necessary???
			columns[column].style.height = ''

	this.logGroupEnd(options.debug)
}