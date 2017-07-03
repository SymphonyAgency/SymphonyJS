export default function equalizeSides(input) {
    this.logGroup(input.debug, 'equalizeSides() setup')
    this.processArrayOrType('object', input, (options) => {
        options.windowEvents = options.windowEvents || ['resize', 'load']
        if (this.domElementExists(options.target, options.source, options.dependency)) {
            this.log(input.debug, 'dependencies exist')
            this.addToQueues({
                func: equalizeSidesRun,
                options: options,
                reset: resetSides,
                name: 'equalizeSides'
            })
        }
    })
    this.logGroupEnd(input.debug)

}


function equalizeSidesRun(options) {
    this.logGroup(options.debug, 'equalizeSides() run')
    let targetList
    let source
    let sourceOffset
    let targetOffset
    let targetWidth
    let sourcePaddingLeft
    let sourcePaddingRight
    let targetProperty
    let sourceWidth
    let documentWidth

    //validation:
    if (!options.source) return console.error('equalizeSides() requires a source')
    if (!options.target) return console.error('equalizeSides() requires a target')
    if (options.spacingProperty === 'width' && options.direction === 'left' ||
        options.spacingProperty === 'widthPadding' && options.direction === 'left' ||
        options.spacingProperty === 'marginPadding' && options.direction === 'left') return console.error('width can only be used with right direction')


    //default options
    options = {
        target: options.target,
        source: options.source,
        direction: options.direction || 'left',
        spacingProperty: options.spacingProperty || 'margin'
    }
    this.log('Options determined: ', options)

    //get dom elements
    targetList = jQuery(options.target)
    if (targetList.length === 0) return this.log(`Target not found ${ options.target }`)
    this.log(`target items found ${targetList.length}:`, targetList)
    source = jQuery(options.source).first()
    if (source.length === 0) return this.log(`Log not found ${source}`)

    targetList.each((index) => {
        var target = jQuery(targetList[index])
        this.log(`Running on index ${index} of found items`, target)
            //construct the target spacing property.
        if (options.spacingProperty === 'left' || options.spacingProperty === 'right') {
            targetProperty = options.spacingProperty
        } else if (options.spacingProperty === 'margin' || options.spacingProperty === 'margin' || options.spacingProperty === 'padding') {
            targetProperty = options.spacingProperty + '-' + options.direction
        } else if (options.spacingProperty === 'width') {
            targetProperty = options.spacingProperty
        } else if (options.spacingProperty === 'marginPadding' || options.spacingProperty === 'widthPadding') {
            targetProperty = options.spacingProperty
        } else {
            return console.error('equalizeSides() accepts target spacingProperty of: padding, margin, left, right, and width')
        }
        this.log(`spacingProperty determined: ${targetProperty}`)

        //left or right handling.
        if (options.direction === 'left') {
            this.log('modifying left side')
            sourceOffset = source.offset().left
            sourcePaddingLeft = parseInt(source.css('padding-left'))
            target.css(targetProperty, sourceOffset + sourcePaddingLeft)
            this.log(`Left CSS modifications added. Total offset: ${sourceOffset + sourcePaddingLeft}`)
        } else if (options.direction === 'right') {
            this.log('modifying right side')
            sourcePaddingRight = parseInt(source.css('padding-right'))
            sourceOffset = source.offset().left
            targetOffset = target.offset().left
            sourceWidth = source.outerWidth()
            targetWidth = target.outerWidth()
            documentWidth = jQuery(document).width()
            let sourceToRight = documentWidth - (sourceOffset + sourceWidth)
            let targetToRight = documentWidth - (targetOffset + targetWidth)

            if (targetProperty === 'margin-right') {
                this.log('margin-right added')
                target.css(targetProperty, sourceToRight)
            } else if (targetProperty === 'padding-right') {
                target.css(targetProperty, sourceToRight + sourcePaddingRight)
                this.log('padding-right added')
            } else if (targetProperty === 'width') {
                target.css(targetProperty, targetWidth + (targetToRight - sourceToRight))
                this.log('width added')
            } else if (targetProperty === 'widthPadding') {
                target.css('width', targetWidth + (targetToRight - sourceToRight))
                target.css('padding-right', sourcePaddingRight)
                this.log('width and padding-right added')
            } else if (targetProperty === 'marginPadding') {
                target.css('margin-right', sourceToRight)
                target.css('padding-right', sourcePaddingRight)
                this.log('margin-right and padding-right added')
            } else {
                return console.error('equalizeSides() hopefully unreachable error in right side properties')
            }
        }



    })

    this.logGroupEnd(options.debug)
}

//TODO
function resetSides(options) {
    this.logGroup(options.debug, 'equalizeSides() reset')
    let targetList
    let source
    let sourceOffset
    let targetOffset
    let targetWidth
    let sourcePaddingLeft
    let sourcePaddingRight
    let targetProperty
    let sourceWidth
    let documentWidth

    //validation:
    if (!options.source) return console.error('equalizeSides() requires a source')
    if (!options.target) return console.error('equalizeSides() requires a target')
    if (options.spacingProperty === 'width' && options.direction === 'left' ||
        options.spacingProperty === 'widthPadding' && options.direction === 'left' ||
        options.spacingProperty === 'marginPadding' && options.direction === 'left') return console.error('width can only be used with right direction')


    //default options
    options = {
        target: options.target,
        source: options.source,
        direction: options.direction || 'left',
        spacingProperty: options.spacingProperty || 'margin'
    }

   //get dom elements
    targetList = jQuery(options.target)
    if (targetList.length === 0) return this.log(`Target not found ${ options.target }`)
    this.log(`target items found ${targetList.length}:`, targetList)
    source = jQuery(options.source).first()
    if (source.length === 0) return this.log(`Log not found ${source}`)

    targetList.each((index) => {
        var target = jQuery(targetList[index])
        this.log(`Running on index ${index} of found items`, target)
            //construct the target spacing property.
        if (options.spacingProperty === 'left' || options.spacingProperty === 'right') {
            targetProperty = options.spacingProperty
        } else if (options.spacingProperty === 'margin' || options.spacingProperty === 'margin' || options.spacingProperty === 'padding') {
            targetProperty = options.spacingProperty + '-' + options.direction
        } else if (options.spacingProperty === 'width') {
            targetProperty = options.spacingProperty
        } else if (options.spacingProperty === 'marginPadding' || options.spacingProperty === 'widthPadding') {
            targetProperty = options.spacingProperty
        } else {
            return console.error('equalizeSides() accepts target spacingProperty of: padding, margin, left, right, and width')
        }

        //left or right handling.
        if (options.direction === 'left') {

            target.css(targetProperty, '')
        } else if (options.direction === 'right') {

            if (targetProperty === 'margin-right') {
                target.css(targetProperty, '')
            } else if (targetProperty === 'padding-right') {
                target.css(targetProperty, '')
            } else if (targetProperty === 'width') {
                target.css(targetProperty, '')
            } else if (targetProperty === 'widthPadding') {
                target.css('width', '')
                target.css('padding-right', '')
            } else if (targetProperty === 'marginPadding') {
                target.css('margin-right', '')
                target.css('padding-right', '')
            } else {
                return console.error('equalizeSides() hopefully unreachable error in right side properties')
            }
            this.log('Reset successful')
        }
    })

    this.logGroupEnd(options.debug)
}