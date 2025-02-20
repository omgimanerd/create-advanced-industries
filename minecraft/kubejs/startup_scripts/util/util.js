// priority: 1000

/**
 * @param {string} name
 * @returns {string}
 */
const getTextureLocation = (name) => {
  checkNamespace(name)
  return name.replace(':', ':item/')
}

/**
 * Only used for registering basic items whose display names match their ID.
 * @callback RegisterItemCallback
 * @param {string} id
 * @param {string?} displayName
 * @param {string?} type
 * @returns {Internal.BasicItemJS$Builder_}
 *
 * @param {Registry.Item} e
 * @returns {RegisterItemCallback}
 */
const registerItem_ = (e) => {
  /**
   * @type {RegisterItemCallback}
   */
  return (id, displayName, type) => {
    checkNamespace(id)
    const item = type === undefined ? e.create(id) : e.create(id, type)
    displayName = displayName === undefined ? getDisplayName(id) : displayName
    return item
      .texture(getTextureLocation(id))
      .formattedDisplayName(displayName)
  }
}
