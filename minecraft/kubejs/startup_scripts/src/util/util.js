// priority: 1000

/**
 * @param {string} s
 * @returns {string}
 */
const stripModPrefix = (s) => {
  return s.replace(/^#{0,1}[a-z_]+:/, '')
}

/**
 * @param {string} s
 */
const checkModPrefix = (s) => {
  if (s.search(/^#{0,1}[a-z_]+:/) < 0) {
    throw new Error(`${s} does not have a mod prefix.`)
  }
}

/**
 * @param {string} name
 * @returns {string}
 */
const getDisplayName = (name) => {
  return stripModPrefix(name)
    .split('_')
    .map((c) => c[0].toUpperCase() + c.substring(1))
    .join(' ')
}

/**
 * @param {string} name
 * @returns {string}
 */
const getTextureLocation = (name) => {
  checkModPrefix(name)
  return name.replace(':', ':item/')
}

/**
 * @callback RegisterItemCallback
 * @param {string} name
 * @param {string?} type
 * @returns {$BasicItemJS$Builder_}
 *
 * @param {Registry.Item} e
 * @returns {RegisterItemCallback}
 */
const registerItem_ = (e) => {
  /**
   * @type {RegisterItemCallback}
   */
  return (name, type) => {
    checkModPrefix(name)
    const item = type === undefined ? e.create(name) : e.create(name, type)
    return item
      .texture(getTextureLocation(name))
      .displayName(getDisplayName(name))
  }
}
