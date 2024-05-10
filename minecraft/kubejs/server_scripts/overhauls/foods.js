// priority: 500
// Recipe overhauls for food related items

ServerEvents.tags('item', (e) => {
  // Allow Create wheat flour to be used in PneumaticCraft sourdough.
  e.add('forge:dusts/flour', 'create:wheat_flour')
})

ServerEvents.recipes((e) => {
  // Consistency overhauls for foods in this modpack, used mostly in chapter 5b

  const create = defineCreateRecipes(e)

  e.remove({ id: /^create_central_kitchen:sequenced_assembly.*/ })
  e.remove({ id: 'create_central_kitchen:crafting/tomato_sauce_from_bucket' })
  e.remove({ id: 'farmersdelight:cooking/tomato_sauce' })
  e.remove({ id: 'create_central_kitchen:mixing/tomato_sauce' })
  create
    .compacting(
      Fluid.of('create_central_kitchen:tomato_sauce', 500),
      '2x farmersdelight:tomato'
    )
    .heated()
  e.remove({ id: 'create_central_kitchen:compacting/honey_cookie' })
  create
    .compacting('farmersdelight:honey_cookie', [
      '2x create:wheat_flour',
      Fluid.of('create:honey', 250),
    ])
    .heated()
  create
    .SequencedAssembly('minecraft:bread')
    .cut()
    .deploy('farmersdelight:fried_egg')
    .deploy('farmersdelight:fried_egg')
    .outputs('2x farmersdelight:egg_sandwich')
  create
    .SequencedAssembly('minecraft:bread')
    .cut()
    .deploy('#forge:cooked_chicken')
    .deploy('#forge:salad_ingredients')
    .deploy('minecraft:carrot')
    .outputs('2x farmersdelight:chicken_sandwich')
  create
    .SequencedAssembly('minecraft:bread')
    .cut()
    .deploy('#forge:salad_ingredients')
    .deploy('farmersdelight:beef_patty')
    .deploy('farmersdelight:tomato')
    .deploy('farmersdelight:onion')
    .outputs('2x farmersdelight:hamburger')
  create
    .SequencedAssembly('minecraft:bread')
    .cut()
    .deploy('#forge:salad_ingredients')
    .deploy('farmersdelight:cooked_bacon')
    .deploy('farmersdelight:tomato')
    .outputs('2x farmersdelight:bacon_sandwich')
  create
    .SequencedAssembly('minecraft:bread')
    .cut()
    .deploy('#forge:salad_ingredients')
    .deploy('#forge:cooked_mutton')
    .deploy('farmersdelight:onion')
    .outputs('farmersdelight:mutton_wrap')
  create
    .SequencedAssembly('minecraft:baked_potato')
    .cut()
    .deploy('#forge:cooked_beef')
    .fill(Fluid.of('minecraft:milk', 250))
    .outputs('farmersdelight:stuffed_potato')

  // Pneumaticcraft foods
  e.remove({ id: 'pneumaticcraft:thermo_plant/chips' })
  create
    .mixing('pneumaticcraft:chips', [
      'minecraft:potato',
      Fluid.of('createaddition:seed_oil', 100),
    ])
    .heated()
  e.remove({ id: 'pneumaticcraft:raw_salmon_tempura' })
  e.shapeless('pneumaticcraft:raw_salmon_tempura', [
    'farmersdelight:salmon_slice',
    'create:dough',
  ])
  create.deploying('pneumaticcraft:raw_salmon_tempura', [
    'farmersdelight:salmon_slice',
    'create:dough',
  ])
  e.remove({ id: 'pneumaticcraft:thermo_plant/salmon_tempura' })
  create
    .mixing('pneumaticcraft:salmon_tempura', [
      'pneumaticcraft:raw_salmon_tempura',
      Fluid.of('createaddition:seed_oil', 100),
    ])
    .heated()
})
