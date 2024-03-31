// priority: 0

StartupEvents.registry('item', e => {

  // Register Andesite Mechanism
  e.create('andesite_mechanism')
    .texture('mechanisms:item/andesite_mechanism')
    .displayName('Andesite Mechanism')

  e.create('incomplete_andesite_mechanism', 'create:sequenced_assembly')
    .texture('mechanisms:item/incomplete_andesite_mechanism')
    .displayName('Incomplete Andesite Mechanism')

})