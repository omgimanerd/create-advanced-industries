// priority: 100

ServerEvents.recipes((e) => {
  // Redstone Mechanisms turn into the various logic components.
  let logicComponents = [
    'minecraft:comparator',
    'minecraft:repeater',
    'quark:redstone_randomizer',
    'create:pulse_extender',
    'create:pulse_repeater',
    'create:powered_toggle_latch',
    'create:powered_latch',
    'createaddition:redstone_relay',
    'create_connected:sequenced_pulse_generator',
    'morered:latch',
    'morered:pulse_gate',
    'morered:redwire_post_plate',
    'morered:redwire_post_relay_plate',
    'morered:hexidecrubrometer',
    'morered:bundled_cable_relay_plate',
    'morered:diode',
    'morered:not_gate',
    'morered:nor_gate',
    'morered:nand_gate',
    'morered:or_gate',
    'morered:and_gate',
    'morered:xor_gate',
    'morered:xnor_gate',
    'morered:multiplexer',
    'morered:and_2_gate',
    'morered:nand_2_gate',
    'morered:bitwise_diode',
    'morered:bitwise_not_gate',
    'morered:bitwise_or_gate',
    'morered:bitwise_and_gate',
    'morered:bitwise_xor_gate',
    'morered:bitwise_xnor_gate',
  ]
  for (let component of logicComponents) {
    if (component.startsWith('morered')) e.remove({ output: component })
    e.stonecutting(component, 'vintageimprovements:redstone_module')
  }
})
