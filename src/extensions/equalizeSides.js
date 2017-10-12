export default function equalizeSides(input) {
  this.processArrayOrType('object', input, (options) => {
    options.windowEvents = options.windowEvents || ['resize', 'load']
    if (this.domElementExists(options.target, options.source, options.dependency)) {
      this.addToQueues({
        func: equalizeSidesRun,
        options: options,
        reset: resetSides,
        name: 'equalizeSides'
      })
    }
  })

}


function equalizeSidesRun(options) {
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
  if (targetList.length === 0) return;
  source = jQuery(options.source).first()
  if (source.length === 0) return;

  targetList.each((index) => {
    var target = jQuery(targetList[index])
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
      sourceOffset = source.offset().left
      sourcePaddingLeft = parseInt(source.css('padding-left'))
      target.css(targetProperty, sourceOffset + sourcePaddingLeft)
    } else if (options.direction === 'right') {
      sourcePaddingRight = parseInt(source.css('padding-right'))
      sourceOffset = source.offset().left
      targetOffset = target.offset().left
      sourceWidth = source.outerWidth()
      targetWidth = target.outerWidth()
      documentWidth = jQuery(document).width()
      let sourceToRight = documentWidth - (sourceOffset + sourceWidth)
      let targetToRight = documentWidth - (targetOffset + targetWidth)

      if (targetProperty === 'margin-right') {
        target.css(targetProperty, sourceToRight)
      } else if (targetProperty === 'padding-right') {
        target.css(targetProperty, sourceToRight + sourcePaddingRight)
      } else if (targetProperty === 'width') {
        target.css(targetProperty, targetWidth + (targetToRight - sourceToRight))
      } else if (targetProperty === 'widthPadding') {
        target.css('width', targetWidth + (targetToRight - sourceToRight))
        target.css('padding-right', sourcePaddingRight)
      } else if (targetProperty === 'marginPadding') {
        target.css('margin-right', sourceToRight)
        target.css('padding-right', sourcePaddingRight)
      } else {
        return console.error('equalizeSides() hopefully unreachable error in right side properties')
      }
    }



  })

}

//TODO
function resetSides(options) {
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
  if (targetList.length === 0) return;
  source = jQuery(options.source).first()
  if (source.length === 0) return;

  targetList.each((index) => {
    var target = jQuery(targetList[index])
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
    }
  })

}