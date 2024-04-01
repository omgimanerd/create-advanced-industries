// priority: 0

StartupEvents.registry('item', e => {

  const getDisplayName = name => {
    return name
      .split('_')
      .map(c => c[0].toUpperCase() + c.substring(1))
      .join(' ')
  }

  const registerMechanism = name => {
    e.create(name)
      .texture(`mechanisms:item/${name}`)
      .displayName(getDisplayName(name))

    const incomplete_name = `incomplete_${name}`
    e.create(incomplete_name, 'create:sequenced_assembly')
      .texture(`mechanisms:item/${incomplete_name}`)
      .displayName(getDisplayName(incomplete_name))
  }

  registerMechanism('andesite_mechanism')
  registerMechanism('copper_mechanism')
  registerMechanism('source_mechanism')

  e.create('zinc_hand')
    .texture(`mechanisms:item/zinc_hand`)
    .displayName('Zinc Hand')
})