// priority: 0

const getDisplayName = (name) => {
  return name
    .split('_')
    .map((c) => c[0].toUpperCase() + c.substring(1))
    .join(' ')
}

const registerItem_ = (e) => {
  return (name, type) => {
    const item = type === undefined ? e.create(name) : e.create(name, type)
    return item
      .texture(`mechanisms:item/${name}`)
      .displayName(getDisplayName(name))
  }
}
