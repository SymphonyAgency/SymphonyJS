export default function custom(input, func, reset) {
	this.logGroup(input.debug, "custom() setup")
	this.processArrayOrType('object', input, (options) => {
		//defaults
		options.windowEvents = options.windowEvents || 'load'

		if (this.domElementExists(options.dependency)) {
			this.log(input.debug, "adding to queues")
			
			this.addToQueues({
				func: (opts)=>{
					this.logGroup(input.debug, 'Custom() run')
					func(opts)
					this.logGroupEnd(input.debug)				
				},
				options: options,
				reset: (opts)=>{
					this.logGroup(input.debug, 'Custom() reset')
					reset(opts)
					this.logGroupEnd(input.debug)				
				},
				name:'custom'
			})
		}
	})
	this.logGroupEnd(input.debug)
}