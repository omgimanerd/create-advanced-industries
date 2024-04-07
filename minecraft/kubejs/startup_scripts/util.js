// priority: 0

global.cai = 'createadvancedindustries'

const getDisplayName = (name) => {
  return name
    .replace(/[a-z]+:/, '')
    .split('_')
    .map((c) => c[0].toUpperCase() + c.substring(1))
    .join(' ')
}

const getResourceLocation = (name) => {
  return name.replace('kubejs', `${global.cai}`).replace(':', ':item/')
}

const registerItem_ = (e) => {
  if (item.search(/[a-z]+:/) < 0) {
    throw Error('Item does not have a mod prefix.')
  }

  return (name, type) => {
    const item = type === undefined ? e.create(name) : e.create(name, type)
    return item
      .texture(getResourceLocation(name))
      .displayName(getDisplayName(name))
  }
}
