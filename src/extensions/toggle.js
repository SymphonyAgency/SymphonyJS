export default function toggle(input) {
	this.logGroup(input.debug, "toggle() setup")
	this.processArrayOrType('object', input, (options) => {
		//defaults
		options.windowEvents = options.windowEvents || ['ready']
		options.display = options.display || null
		options.visibility = options.visibility || null
		if (!options.display && !options.visibility) options.display = 'block'

		if (this.domElementExists([options.button, options.target])) {
			this.addToQueues({
				func: toggleRun,
				options: options,
				reset: toggleReset,
				name: 'toggle'
			})
		}
	})
	this.logGroupEnd(input.debug)

}

function toggleRun(options) {
	this.logGroup(options.debug, 'toggle() run')
	let button = this.$(options.button)
	let target = this.$(options.target)
	let $ = this.$

	if (options.display) {

		button.on('click', () => {

			target.each(function () {
				let element = $(this)
				if (element.css('display') === 'none') {
					element.css('display', options.display)
				} else {
					element.css('display', 'none')
				}
			})
		})
	} else if (options.visibility) {
		button.on('click', () => {
			target.each(function () {
				if (this.css('visibility') === 'hidden') {
					this.css('visibility', options.visibility)
				} else {
					this.css('visibility', 'hidden')
				}
			})
		})
	} else {
		console.warn('SymphonyJs.toggle() both display and visibility are not set.  Shouldnt happen')
	}
	this.logGroupEnd(options.debug)

}

function toggleReset(options) {
	this.logGroup(options.debug, 'toggle() run')
	let button = this.$(options.button)
	let target = this.$(options.target)

	button.off('click')
	target.each(function(){
		this.removeAttribute('style');
	})
	this.logGroupEnd(options.debug)
}