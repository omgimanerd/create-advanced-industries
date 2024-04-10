// priority: 100

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)
  const registerMechanism = (name) => {
    registerItem(name)
    registerItem(
      `kubejs:incomplete_${stripPrefix(name)}`,
      'create:sequenced_assembly'
    )
  }

  registerMechanism('kubejs:andesite_mechanism')
  registerMechanism('kubejs:copper_mechanism')
  registerMechanism('kubejs:source_mechanism')
  // Precision mechanism defined by Create
  // Steel mechanism defined by TFMG

  // Logistics Mechanism
  e.create('kubejs:logistics_mechanism')
    .texture(getResourceLocation('pneumaticcraft:logistics_core'))
    .displayName('Logistics Mechanism')
  e.create('kubejs:incomplete_logistics_mechanism', 'create:sequenced_assembly')
    .texture(getResourceLocation('pneumaticcraft:logistics_core'))
    .displayName('Incomplete Logistics Mechanism')

  // TBD
  registerMechanism('kubejs:plastic_mechanism')
})
