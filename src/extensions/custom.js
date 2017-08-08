export default function custom(input, func, reset) {
	this.processArrayOrType('object', input, (options) => {
		//defaults
		options.windowEvents = options.windowEvents || 'load'

		if (this.domElementExists(options.dependency)) {
			this.addToQueues({
				func: (opts)=>{
					func(opts)
				},
				options: options,
				reset: (opts)=>{
					reset(opts)
				},
				name:'custom'
			})
		}
	})
}