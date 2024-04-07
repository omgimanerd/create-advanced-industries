// priority: 100

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)
  const registerMechanism = (name) => {
    registerItem(name)
    registerItem(`kubejs:incomplete_${name}`, 'create:sequenced_assembly')
  }

  registerMechanism('kubejs:andesite_mechanism')
  registerMechanism('kubejs:copper_mechanism')
  registerMechanism('kubejs:source_mechanism')
})
