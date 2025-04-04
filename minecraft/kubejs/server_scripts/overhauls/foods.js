// priority: 500
// Recipe overhauls for food related items

ItemEvents.foodEaten((e) => {
  const { item, player } = e
  if (!item.enchanted) return
  const level = item.enchantments.get('kubejs:nutrient_infusion')
  player.potionEffects.add(
    'minecraft:saturation',
    5 * level * 20, // 5 seconds times 20 ticks per second per level
    level, // effect amplifier level
    false, // ambient
    false // showParticles
  )
})

ServerEvents.tags('item', (e) => {
  // Tag all enchantable foods.
  for (const food of Utils.getRegistryIds('item')) {
    if (food === 'artifacts:eternal_steak') continue
    if (food === 'artifacts:everlasting_beef') continue
    if (Item.of(food).isEdible()) {
      e.add('kubejs:enchantable_foods', food)
    }
  }

  // Allow Create wheat flour to be used in PneumaticCraft sourdough.
  e.add('forge:dusts/flour', 'create:wheat_flour')
})

ServerEvents.recipes((e) => {
  // Consistency overhauls for foods in this modpack, used mostly in Chapter 5b
  const create = defineCreateRecipes(e)

  // Allow for Nutrient Infusion's enchantment book to be created with Ars
  // Nouveau
  e.recipes.ars_nouveau.enchantment(
    [
      'farmersdelight:cooked_bacon',
      'minecraft:melon_slice',
      'farmersdelight:fried_egg',
      'farmersdelight:tomato_sauce',
    ],
    'kubejs:nutrient_infusion',
    1,
    2000
  )
  e.recipes.ars_nouveau.enchantment(
    [
      'farmersdelight:cooked_bacon',
      'minecraft:melon_slice',
      'farmersdelight:fried_egg',
      'farmersdelight:tomato_sauce',
      'minecraft:cookie',
    ],
    'kubejs:nutrient_infusion',
    2,
    3500
  )
  e.recipes.ars_nouveau.enchantment(
    [
      'farmersdelight:cooked_bacon',
      'minecraft:melon_slice',
      'farmersdelight:fried_egg',
      'farmersdelight:tomato_sauce',
      'farmersdelight:bacon_sandwich',
    ],
    'kubejs:nutrient_infusion',
    3,
    5000
  )
  e.recipes.ars_nouveau.enchantment(
    [
      'farmersdelight:cooked_bacon',
      'minecraft:melon_slice',
      'farmersdelight:fried_egg',
      'farmersdelight:bacon_sandwich',
      'farmersdelight:bacon_sandwich',
    ],
    'kubejs:nutrient_infusion',
    4,
    6500
  )
  e.recipes.ars_nouveau.enchantment(
    [
      'farmersdelight:cooked_bacon',
      'minecraft:melon_slice',
      'farmersdelight:fried_egg',
      'farmersdelight:bacon_sandwich',
      'farmersdelight:bacon_sandwich',
      'farmersdelight:bacon_and_eggs',
    ],
    'kubejs:nutrient_infusion',
    5,
    8000
  )

  // Create Central Kitchen + Farmer's Delight
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

  // Straw can be obtained from wheat.
  e.remove({ id: 'create:milling/wheat' })
  create.milling(
    [
      'create:wheat_flour',
      'farmersdelight:straw',
      Item.of('create:wheat_flour', 2).withChance(0.25),
    ],
    'minecraft:wheat'
  )
  e.recipes.farmersdelight.cutting(
    'minecraft:wheat_seeds',
    ['create:wheat_flour', 'farmersdelight:straw'],
    '#farmersdelight:tools/knives'
  )

  // Cookies?
  e.remove({ id: 'create_central_kitchen:compacting/cookie' })
  create.mixing('8x minecraft:cookie', [
    '#forge:dough/wheat',
    'minecraft:cocoa_beans',
  ])

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
    '#forge:dough/wheat',
  ])
  create.deploying('pneumaticcraft:raw_salmon_tempura', [
    'farmersdelight:salmon_slice',
    '#forge:dough/wheat',
  ])
  e.remove({ id: 'pneumaticcraft:thermo_plant/salmon_tempura' })
  create
    .mixing('pneumaticcraft:salmon_tempura', [
      'pneumaticcraft:raw_salmon_tempura',
      Fluid.of('createaddition:seed_oil', 100),
    ])
    .heated()
  // Remove crafting grid recipe for sourdough
  e.remove({ id: 'pneumaticcraft:sourdough' })
  create.mixing('pneumaticcraft:sourdough', [
    'create:wheat_flour',
    Fluid.of('pneumaticcraft:yeast_culture', 125),
  ])
})
