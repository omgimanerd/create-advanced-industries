// priority: 500
// Recipes to combine and break down dyes

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // All compound dyes can be composed of two other dyes, which themselves may
  // also be compound dyes.
  const DYE_COMPOUNDS = {
    'minecraft:light_gray_dye': ['minecraft:white_dye', 'minecraft:gray_dye'],
    'minecraft:gray_dye': ['minecraft:white_dye', 'minecraft:black_dye'],
    'minecraft:orange_dye': ['minecraft:red_dye', 'minecraft:yellow_dye'],
    'minecraft:lime_dye': ['minecraft:green_dye', 'minecraft:white_dye'],
    'minecraft:cyan_dye': ['minecraft:blue_dye', 'minecraft:green_dye'],
    'minecraft:light_blue_dye': ['minecraft:blue_dye', 'minecraft:white_dye'],
    'minecraft:purple_dye': ['minecraft:blue_dye', 'minecraft:red_dye'],
    'minecraft:magenta_dye': ['minecraft:purple_dye', 'minecraft:pink_dye'],
    'minecraft:pink_dye': ['minecraft:red_dye', 'minecraft:white_dye'],
  }

  // By default the dyes can be broken down by centrifugation, but they can
  // also be milled or crushed for a chance output.
  for (const [output, inputs] in DYE_COMPOUNDS) {
    create.milling(
      inputs.map((id) => {
        return Item.of(id).withChance(0.25)
      }),
      output
    )
    create.crushing(
      inputs.map((id) => {
        return Item.of(id).withChance(0.5)
      }),
      output
    )
  }
})
