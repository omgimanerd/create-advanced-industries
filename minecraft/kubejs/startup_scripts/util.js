// priority: 0

global.cai = 'createadvancedindustries'

const stripPrefix = (s) => {
  return s.replace(/[a-z]+:/, '')
}

const checkPrefix = (s) => {
  if (s.search(/[a-z]+:/) < 0) {
    throw new Error('Item does not have a mod prefix.')
  }
}

const getDisplayName = (name) => {
  return stripPrefix(name)
    .split('_')
    .map((c) => c[0].toUpperCase() + c.substring(1))
    .join(' ')
}

const getResourceLocation = (name) => {
  checkPrefix(name)
  return name.replace(/^kubejs:/, `${global.cai}:`).replace(':', ':item/')
}

const registerItem_ = (e) => {
  return (name, type) => {
    checkPrefix(name)
    const item = type === undefined ? e.create(name) : e.create(name, type)
    return item
      .texture(getResourceLocation(name))
      .displayName(getDisplayName(name))
  }
}
