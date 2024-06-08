// priority: 100

StartupEvents.recipeSchemaRegistry((e) => {
  const $RecipeSchema = Java.loadClass(
    'dev.latvian.mods.kubejs.recipe.schema.RecipeSchema'
  )
  const $RecipeComponentBuilder = Java.loadClass(
    'dev.latvian.mods.kubejs.recipe.component.RecipeComponentBuilder'
  )

  // Input/output component types
  const Components = e.components
  const inputItem = Components.get('inputItem')()
  const inputItemArray = Components.get('inputItemArray')()
  const inputFluidOrItemArray = Components.get('inputFluidOrItemArray')()
  const outputItem = Components.get('outputItem')()
  const outputItemArray = Components.get('outputItemArray')()
  const outputFluidOrItemArray = Components.get('outputFluidOrItemArray')()
  const fluidOrTagInput = Components.get('inputFluid')().or(
    new $RecipeComponentBuilder(2)
      .add(Components.get('tag')({ registry: 'fluid' }).key('fluidTag'))
      .add(Components.get('intNumber')().key('amount'))
      .inputRole()
  )

  const bool = Components.get('bool')()
  const intNumber = Components.get('intNumber')()
  const id = Components.get('id')()

  // Create Crafts & Additions
  if (Platform.isLoaded('createaddition')) {
    e.register(
      'createaddition:rolling',
      new $RecipeSchema(outputItem.key('result'), inputItem.key('input'))
    )
    e.register(
      'createaddition:charging',
      new $RecipeSchema(
        outputItem.key('result'),
        inputItem.key('input'),
        intNumber.key('energy'),
        intNumber.key('maxChargeRate').optional(Number.MAX_VALUE)
      )
    )
    e.register(
      'createaddition:liquid_burning',
      new $RecipeSchema(
        intNumber.key('burnTime'),
        fluidOrTagInput.key('input'),
        bool.key('superheated').optional(false)
      )
    )
    console.log('Recipe Schemas for createaddition loaded.')
  }

  // Create: New Age
  if (Platform.isLoaded('create_new_age')) {
    e.register(
      'create_new_age:energising',
      new $RecipeSchema(
        outputItem.asArray().key('results'),
        inputItem.asArray().key('ingredients'),
        intNumber.key('energy_needed')
      )
    )
    console.log('Recipe Schemas for create_new_age loaded.')
  }

  // Create Mechanical Extruder
  if (Platform.isLoaded('create_mechanical_extruder')) {
    e.register(
      'create_mechanical_extruder:extruding',
      new $RecipeSchema(
        outputItem.key('result'),
        inputFluidOrItemArray.key('ingredients')
      )
    )
    console.log('Recipe Schemas for create_mechanical_extruder loaded.')
  }

  // Create: Vintage Improvements
  if (Platform.isLoaded('vintageimprovements')) {
    e.register(
      'vintageimprovements:centrifugation',
      new $RecipeSchema(
        outputFluidOrItemArray.key('results'),
        inputFluidOrItemArray.key('ingredients'),
        intNumber.key('minimalRPM').optional(100),
        intNumber.key('processingTime').optional(1000)
      )
    )
    e.register(
      'vintageimprovements:coiling',
      new $RecipeSchema(
        outputItem.asArray().key('results'),
        inputItem.asArray().key('ingredients'),
        intNumber.key('processingTime').optional(120)
      )
    )
    e.register(
      'vintageimprovements:curving',
      new $RecipeSchema(
        outputItem.asArray().key('results'),
        inputItem.asArray().key('ingredients'),
        id.key('itemAsHead').allowEmpty().defaultOptional(),
        intNumber.key('mode').allowEmpty().optional(0)
      )
    )
    e.register(
      'vintageimprovements:polishing',
      new $RecipeSchema(
        outputItem.asArray().key('results'),
        inputItem.asArray().key('ingredients'),
        intNumber.key('processingTime').optional(20)
      )
    )
    e.register(
      'vintageimprovements:hammering',
      new $RecipeSchema(
        outputItem.asArray().key('results'),
        inputItem.asArray().key('ingredients'),
        intNumber.key('hammerBlows').optional(3)
      )
    )
    e.register(
      'vintageimprovements:pressurizing',
      new $RecipeSchema(
        outputItemArray.key('results'),
        inputItemArray.key('ingredients'),
        intNumber.key('secondaryFluidResults').allowEmpty().optional(0),
        intNumber.key('secondaryFluidInputs').allowEmpty().optional(0)
      )
    )
    e.register(
      'vintageimprovements:vacuumizing',
      new $RecipeSchema(
        outputFluidOrItemArray.key('results'),
        inputFluidOrItemArray.key('ingredients'),
        intNumber.key('processingTime').optional(20)
      )
    )
    e.register(
      'vintageimprovements:vibrating',
      new $RecipeSchema(
        outputItem.asArray().key('results'),
        inputItem.asArray().key('ingredients'),
        intNumber.key('processingTime').optional(20)
      )
    )
    console.log('Recipe Schemas for vintageimprovements loaded.')
  }
})
