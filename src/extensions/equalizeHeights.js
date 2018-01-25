export default function (input) {
    this.processArrayOrType('object', input, (options) => {
        options.windowEvents = options.windowEvents || ['resize', 'load']

        if (this.domElementExists([options.selector, options.dependency])) {

            this.addToQueues({
                func: equalizeHeights,
                options: options,
                reset: reset,
                name: 'equalizeHeights',
            })
        } else {
        }
    })
}

/**
 * EqualizeHeights class.
 *
 * Equalize heights among a NodeList.
 *
 * Cannot be a real "class" because SymphonyJs adds extension functions to the
 * prototype, so this.equalizeHeights refers to SymphonyJs's context rather than
 * the created class's.
 *
 * @param options
 */
function equalizeHeights(options) {
	/**
	 * Get tallest element from a NodeList.
	 *
	 * @param columns
	 * @returns {*}
	 */
    function getTallestElementHeight(columns) {
        let heights = []

        Array.prototype.forEach.call(columns, el => {
            el.style.height = 'auto'
            heights.push(el.clientHeight)
        })

        heights.sort((a, b) => b - a)

        return heights[0]
    }

	/**
	 * Set column heights.
	 *
	 * @param columns
	 */
    function setColumnHeights(columns, height) {
        Array.prototype.forEach.call(columns, column => {
            column.style.height = height + 'px'
        })
    }

	/**
	 * Equalize heights of elements in a NodeList.
	 *
	 * @param columns
	 */
    function equalizeHeights(columns) {
        let height = getTallestElementHeight(columns)
        setColumnHeights(columns, height)
    }

	/**
	 * Equalize heights by using tallest sibling of selector's parent.
	 *
	 * @param column
	 */
    function useTallestSibling(column) {
        let parentRefs = []

        Array.prototype.forEach.call(columns, column => {
            let parentRef = parentRefs.find(parent => {
                return parent.ref === column.parentElement
            })

            if (parentRef) {
                parentRef.columns.push(column)
            } else {
                parentRefs.push({
                    ref: column.parentElement,
                    columns: [column],
                })
            }
        })
        parentRefs.forEach(({ columns }) => equalizeHeights(columns))
    }

	/**
	 * Equalize heights by using the tallest node sharing the same ancestor.
	 *
	 * @param column
	 */
    function useTallestFromAncestor(column) {
        let parentRefs = []
        let maxAncestors = options.useTallestFromAncestor.maxAncestors
        let ancestor = options.useTallestFromAncestor.className
        let newAncestor = null
        let ancestorLevel

        Array.prototype.forEach.call(columns, column => {
            let parentRef = parentRefs.find(parent => {
                let parentEl = column.parentElement
                ancestorLevel = 0

                while (ancestorLevel < maxAncestors) {
                    if (parentEl === parent.ref) {
                        return true
                    } else if (parentEl.classList.contains(ancestor)) {
                        newAncestor = parentEl
                    } else {
                        parentEl = parentEl.parentElement
                    }
                    ancestorLevel++
                }
            })

            if (!newAncestor) {
                let parentEl = column.parentElement
                ancestorLevel = 0

                while (ancestorLevel < maxAncestors) {
                    if (parentEl.classList.contains(ancestor)) {
                        newAncestor = parentEl
                    } else {
                        parentEl = parentEl.parentElement
                    }
                    ancestorLevel++
                }
            }

            if (parentRef) {
                parentRef.columns.push(column)
            } else if (newAncestor) {
                parentRefs.push({
                    ref: newAncestor,
                    columns: [column],
                })
            }
        })

        parentRefs.forEach(({ columns }) => equalizeHeights(columns))
    }

	/**
	 * Run
	 */
    let columns = document.querySelectorAll(options.selector)

    if (options.useTallestSibling) {
        useTallestSibling(columns)
    }
    else if (options.useTallestFromAncestor) {
        useTallestFromAncestor(columns)
    } else {
        equalizeHeights(columns)
    }
}

/**
 * Reset heights.
 *
 * @param options
 */
function reset(options) {
    let columns = document.querySelectorAll(options.selector)

    Array.prototype.forEach.call(columns, column => column.style.height = '')
}
