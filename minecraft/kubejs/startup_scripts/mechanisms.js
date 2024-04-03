// priority: 100

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)
  const registerMechanism = (name) => {
    registerItem(name)
    registerItem(`incomplete_${name}`, 'create:sequenced_assembly')
  }

  registerMechanism('andesite_mechanism')
  registerMechanism('copper_mechanism')
  registerMechanism('source_mechanism')
})
