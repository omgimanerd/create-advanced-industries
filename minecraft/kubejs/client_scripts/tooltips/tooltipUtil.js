// priority: 1000

/**
 * Type definitions for custom arguments used by the tooltip util.
 *
 * @typedef {(string|string[])} StringOrStringArray
 *
 * @typedef {Object} TooltipHelperOptions
 * @property {StringOrStringArray=} baseText Text that is shown regardless of
 *   whether or not shift is held.
 * @property {StringOrStringArray=} unShiftText Text that is shown when shift
 *   is not held.
 * @property {StringOrStringArray=} shiftText Text that is shown when shift is
 *   held.
 * @property {StringOrStringArray=} unAltText Text that is shown when alt is not
 *  held.
 * @property {StringOrStringArray=} altText Text that is shown
 * @property {boolean=} clear Whether or not to clear the existing tooltip.
 */

/**
 * @param {Internal.ItemTooltipEventJS_} e
 * @param {Internal.ItemStack_} item
 * @param {TooltipHelperOptions} options
 */
const tooltipHelper = (e, item, options) => {
  const { baseText, unShiftText, shiftText, unAltText, altText, clear } =
    options

  /**
   * Internal helper to add to the tooltip text list, calls parseTextFormat on
   * string arguments.
   * @param {Internal.List} text
   * @param {(string[]|Internal.MutableComponent_[]|Internal.List_)} newText
   */
  const addText = (text, newText) => {
    if (newText !== null && newText !== undefined) {
      if (newText.class === 'class java.util.ArrayList') {
        text.addAll(newText)
        return
      }
      ;(Array.isArray(newText) ? newText : [newText]).forEach((v) => {
        text.add(typeof v === 'string' ? global.parseTextFormat(v) : v)
      })
    }
  }

  e.addAdvanced(item, (itemstack, advanced, text) => {
    let last = []
    // Last element is the id if advanced tooltips are enabled. Store this and
    // add it back on at the end.
    if (advanced) {
      // If the itemstack has nbt data, then the number of tags will be present
      // in the tooltip.
      if (itemstack.nbt !== null) {
        last.push(text.remove(text.size() - 1))
      }
      last.push(text.remove(text.size() - 1))
    }

    // If enabled, remove all tooltip elements except the first, which is the
    // item name.
    if (clear) {
      while (text.size() > 1) {
        text.remove(text.size() - 1)
      }
    }

    addText(text, baseText)
    addText(text, e.shift ? shiftText : unShiftText)
    addText(text, e.alt ? altText : unAltText)

    for (const element of last.reverse()) {
      text.add(element)
    }
  })
}

/**
 * Takes the given string or string array argument and truncates each element
 * such that none exceed the argument width.
 * @param {string[]} text
 * @param {number} width
 * @returns {string[]}
 */
const textWrap = (text, width) => {
  const elements = []
  for (let t of Array.isArray(text) ? text : [text]) {
    let currentString = ''
    for (const word of t.split(' ')) {
      if (currentString.length + word.length + 1 > width) {
        elements.push(currentString)
        currentString = word
      } else if (currentString === '') {
        currentString = word
      } else {
        currentString += ` ${word}`
      }
    }
    elements.push(currentString)
  }
  return elements
}
