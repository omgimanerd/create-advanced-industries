// priority: 10000
// See https://minecraft.fandom.com/wiki/Resource_location for more information
// about the specific format of resource locations.

/**
 * @param {string} string Checks if the given string is a valid resource
 * location with a namespace. Allows tag strings.
 * @throws {Error} If the string does not contain a namespace.
 */
const checkNamespace = (global.checkNamespace = (rl) => {
  if (rl.search(/^#{0,1}[0-9a-z_\-\.]+:/) < 0) {
    throw new Error(`${rl} does not have a proper namespace.`)
  }
})

/**
 * @param {string} rl The resource location to strip the namespace from. Allows
 * tag strings.
 * @returns {string} A string containing just the ID.
 */
const stripNamespace = (global.stripNamespace = (rl) => {
  return rl.replace(/^#{0,1}[0-9a-z_\-\.]+:/, '')
})

/**
 * Returns the normal display name for a given resource location id, assuming
 * that the display name is the uppercase version of the id, with spaces instead
 * of underscores.
 * @param {string} rl The resource location to get the display name for.
 * @returns {string} The display name of the resource location.
 */
const getDisplayName = (global.getDisplayName = (rl) => {
  return stripNamespace(rl)
    .split('_')
    .map((c) => c[0].toUpperCase() + c.substring(1))
    .join(' ')
})
