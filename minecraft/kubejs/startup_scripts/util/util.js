// priority: 1000

global.cai = 'kubejs'

/**
 * @param {string} s
 * @returns {string}
 */
const stripPrefix = (s) => {
  return s.replace(/^#{0,1}[a-z_]+:/, '')
}

/**
 * @param {string} s
 */
const checkPrefix = (s) => {
  if (s.search(/^#{0,1}[a-z_]+:/) < 0) {
    throw new Error(`${s} does not have a mod prefix.`)
  }
}

/**
 * @param {string} name
 * @returns {string}
 */
const getDisplayName = (name) => {
  return stripPrefix(name)
    .split('_')
    .map((c) => c[0].toUpperCase() + c.substring(1))
    .join(' ')
}

/**
 * @param {string} name
 * @returns {string}
 */
const getResourceLocation = (name) => {
  checkPrefix(name)
  return name.replace(/^kubejs:/, `${global.cai}:`).replace(':', ':item/')
}

/**
 * @callback RegisterItemWrapperCallback
 * @param {string} name
 * @param {string} type
 * @returns {Internal.BasicItemJS$Builder}
 */
/**
 * @param {Registry.Item} e
 * @returns {Internal.BasicItemJS$Builder}
 */
const registerItem_ = (e) => {
  /**
   * @type {RegisterItemWrapperCallback}
   */
  return (name, type) => {
    checkPrefix(name)
    const item = type === undefined ? e.create(name) : e.create(name, type)
    return item
      .texture(getResourceLocation(name))
      .displayName(getDisplayName(name))
  }
}
