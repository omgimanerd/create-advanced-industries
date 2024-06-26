// priority: 1000

/**
 * Given a string or array of strings with XML-style opening and closing tags,
 * this helper returns a text component with the tag formatting applied.
 * Unlike real XML, this syntax allows for tags to be overlapped.
 *
 * Any valid method of MutableComponent can be used as a tag.
 *
 * Example usage:
 *   global.parseTextFormat(
 *     '<italic>hello <green> world!</green> it's me!</italic>')
 *   global.parseTextFormat(
 *     '<italic>italic <green> italic and green </italic> green </green>')
 *
 * @param {string} t
 * @returns {$MutableComponent_}
 */
global.parseTextFormat = (t) => {
  let modifiers = {}
  let component = null
  const parts = t.split(/(<\/{0,1}[a-zA-Z]+>)/)
  for (const /** @type {string} */ part of parts) {
    let openMatch = part.match(/^<([a-zA-Z]+)>$/)
    let closeMatch = part.match(/^<\/([a-zA-Z]+)>$/)
    // If the split text part matches an open tag, add it to the modifiers
    if (openMatch !== null && openMatch.length === 2) {
      let modifier = /** @type {string} */ openMatch[1]
      if (modifiers[modifier]) {
        console.warn(`Extra modifier ${modifier} in ${t}`)
      }
      modifiers[modifier] = true
      // If the split text part matches a close tag, remove it from the
      // modifiers
    } else if (closeMatch !== null && closeMatch.length == 2) {
      let modifier = /** @type {string} */ closeMatch[1]
      if (!modifiers[modifier]) {
        console.warn(`Extra closing modifier ${modifier} in ${t}`)
      }
      delete modifiers[modifier]
    } else {
      // If the string is not a tag and non-empty, format it with the modifiers
      // and append it to the components array.
      if (part === '') continue
      let newComponent = Text.string(part)
      for (const [modifier, _] of Object.entries(modifiers)) {
        let modifierCall = newComponent[modifier]
        if (modifierCall === undefined) {
          console.warn(`Unknown modifier ${modifier} in ${t}`)
          continue
        }
        newComponent = modifierCall.call(newComponent)
      }

      if (component === null) {
        component = newComponent
      } else {
        component = component.append(newComponent)
      }
    }
  }
  return component === null ? Text.empty() : component
}
