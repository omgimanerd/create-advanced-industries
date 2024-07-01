// priority: 1000

/**
 * @param {Internal.ItemTooltipEventJS_} e
 * @param {Internal.ItemStack_} item
 * @param {string|string[]} baseText
 * @param {(string|string[])?} unshiftText
 * @param {(string|string[])?} shiftText
 * @param {boolean?} clear
 */
const tooltipHelper = (e, item, baseText, shiftText, unshiftText, clear) => {
  /**
   * Internal helper
   * @param {Internal.List} text
   * @param {}
   */
  const addText = (text, newText) => {
    if (newText !== null && newText !== undefined) {
      newText = Array.isArray(newText) ? newText : [newText]
      for (const t of newText) {
        text.add(global.parseTextFormat(t))
      }
    }
  }

  e.addAdvanced(item, (_, advanced, text) => {
    let last = undefined
    // Last element is the id if advanced tooltips are enabled.
    if (advanced) {
      last = text.remove(text.size() - 1)
    }
    if (clear) {
      text.clear()
    }
    addText(text, baseText)
    if (e.shift) {
      addText(text, shiftText)
    } else {
      addText(text, unshiftText)
    }
    if (last) {
      text.add(last)
    }
  })
}
