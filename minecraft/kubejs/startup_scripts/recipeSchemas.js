// priority: 100

StartupEvents.recipeSchemaRegistry((e) => {
  const $RecipeSchema = Java.loadClass(
    'dev.latvian.mods.kubejs.recipe.schema.RecipeSchema'
  )
  const $RecipeComponentBuilder = Java.loadClass(
    'dev.latvian.mods.kubejs.recipe.component.RecipeComponentBuilder'
  )
  const $HeatCondition = Java.loadClass(
    'com.simibubi.create.content.processing.recipe.HeatCondition'
  )

  // Input/output component types
  const Components = e.components

  const anyString = Components.get('anyString')()
  const bool = Components.get('bool')()
  const id = Components.get('id')()
  const intNumber = Components.get('intNumber')()
  const floatNumber = Components.get('floatNumber')()

  const filteredString = Components.get('filteredString')

  const inputItem = Components.get('inputItem')()
  const outputItem = Components.get('outputItem')()

  const inputFluid = Components.get('inputFluid')()
  const fluidTag = Components.get('tag')({ registry: 'fluid' })
  const fluidOrTagInput = inputFluid.or(
    new $RecipeComponentBuilder(2)
      .add(fluidTag.key('fluidTag'))
      .add(intNumber.key('amount'))
      .inputRole()
  )
  const outputFluid = Components.get('outputFluid')()

  const inputFluidOrItem = Components.get('inputFluidOrItem')()
  const outputFluidOrItem = Components.get('outputFluidOrItem')()

  const heatCondition = Components.get('enum')({ class: $HeatCondition })

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
        intNumber.key('maxChargeRate').optional(0)
      )
    )
    e.register(
      'createaddition:liquid_burning',
      new $RecipeSchema(
        fluidOrTagInput.key('input'),
        intNumber.key('burnTime'),
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
        inputFluidOrItem.asArray().key('ingredients'),
        inputItem.key('catalyst').defaultOptional()
      )
    )
    console.log('Recipe Schemas for create_mechanical_extruder loaded.')
  }

  // Create: Vintage Improvements
  if (Platform.isLoaded('vintageimprovements')) {
    e.register(
      'vintageimprovements:centrifugation',
      new $RecipeSchema(
        outputFluidOrItem.asArray().key('results'),
        inputFluidOrItem.asArray().key('ingredients'),
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
        id.key('itemAsHead').defaultOptional(),
        intNumber.key('mode').optional(0)
      )
    )
    e.register(
      'vintageimprovements:polishing',
      new $RecipeSchema(
        outputItem.asArray().key('results'),
        inputItem.asArray().key('ingredients'),
        intNumber.key('speed_limits').optional(1),
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
        outputFluidOrItem.asArray().key('results'),
        inputFluidOrItem.asArray().key('ingredients'),
        intNumber.key('secondaryFluidResults').optional(0),
        intNumber.key('secondaryFluidInputs').optional(0),
        intNumber.key('processingTime').alwaysWrite().optional(40),
        heatCondition.key('heatRequirement').optional('none')
      )
    )
    e.register(
      'vintageimprovements:vacuumizing',
      new $RecipeSchema(
        outputFluidOrItem.asArray().key('results'),
        inputFluidOrItem.asArray().key('ingredients'),
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

  // PneumaticCraft: Repressurized
  if (Platform.isLoaded('pneumaticcraft')) {
    let pncrAmadronIO = new $RecipeComponentBuilder(3)
      .add(
        filteredString({
          error: 'must be ITEM or FLUID',
          filter: (s) => {
            return s === 'ITEM' || s === 'FLUID'
          },
        }).key('type')
      )
      .add(intNumber.key('amount'))
      .add(id.key('id'))
      .inputRole()

    let pncrFluidInput = fluidOrTagInput
      .simpleMap({ fluidTag: 'tag' })
      .mapOut((json) => {
        json.getAsJsonObject().addProperty('type', 'pneumaticcraft:fluid')
        return json
      })
    let pncrItemInput = inputItem.mapOut((json) => {
      json.getAsJsonObject().addProperty('type', 'pneumaticcraft:stacked_item')
      return json
    })

    let pncrBonusOutput = new $RecipeComponentBuilder(2)
      .add(floatNumber.key('limit'))
      .add(floatNumber.key('multiplier'))
      .inputRole()
      .key('bonus_output')
    let pncrTempRange = new $RecipeComponentBuilder(2)
      .add(intNumber.key('min_temp').optional(0))
      .add(intNumber.key('max_temp').optional(0))
      .inputRole()
      .key('temperature')

    e.register(
      'pneumaticcraft:amadron',
      new $RecipeSchema(
        pncrAmadronIO.asArray().key('input'),
        pncrAmadronIO.asArray().key('output'),
        intNumber.key('level').optional(0),
        bool.key('static').alwaysWrite().optional(true)
      )
    )
    e.register(
      'pneumaticcraft:assembly_drill',
      new $RecipeSchema(
        pncrItemInput.key('input'),
        outputItem.key('result'),
        anyString.key('program').alwaysWrite().optional('drill')
      )
    )
    e.register(
      'pneumaticcraft:assembly_laser',
      new $RecipeSchema(
        pncrItemInput.key('input'),
        outputItem.key('result'),
        anyString.key('program').alwaysWrite().optional('laser')
      )
    )
    e.register(
      'pneumaticcraft:explosion_crafting',
      new $RecipeSchema(
        pncrItemInput.key('input'),
        outputItem.asArray().key('results'),
        intNumber.key('loss_rate').alwaysWrite().optional(20)
      )
    )
    e.register(
      'pneumaticcraft:fluid_mixer',
      new $RecipeSchema(
        pncrFluidInput.key('input1'),
        pncrFluidInput.key('input2'),
        floatNumber.key('pressure').optional(1),
        intNumber.key('time').optional(40),
        outputItem.key('item_output').defaultOptional(),
        outputFluid.key('fluid_output').defaultOptional()
      )
    )
    e.register(
      'pneumaticcraft:heat_frame_cooling',
      new $RecipeSchema(
        pncrFluidInput.key('input'),
        outputItem.key('result'),
        intNumber.key('max_temp').optional(0),
        pncrBonusOutput.defaultOptional()
      )
    )
    e.register(
      'pneumaticcraft:fuel_quality',
      new $RecipeSchema(
        pncrFluidInput.key('fluid'),
        intNumber.key('air_per_bucket'),
        floatNumber.key('burn_rate')
      )
    )
    e.register(
      'pneumaticcraft:pressure_chamber',
      new $RecipeSchema(
        pncrItemInput.asArray().key('inputs'),
        outputItem.asArray().key('results'),
        floatNumber.key('pressure')
      )
    )
    e.register(
      'pneumaticcraft:refinery',
      new $RecipeSchema(
        pncrFluidInput.key('input'),
        outputFluid.asArray().key('results'),
        pncrTempRange
      )
    )
    e.register(
      'pneumaticcraft:thermo_plant',
      new $RecipeSchema(
        pncrFluidInput.key('fluid_input').defaultOptional(),
        inputItem.key('item_input').defaultOptional(),
        outputFluid.key('fluid_output').defaultOptional(),
        outputItem.key('item_output').defaultOptional(),
        pncrTempRange.defaultOptional(),
        bool.key('exothermic').alwaysWrite().optional(false),
        floatNumber.key('pressure').optional(0),
        floatNumber.key('air_use_multiplier').optional(0),
        floatNumber.key('speed').optional(0)
      )
    )

    let $ShapedRecipeSchema = Java.loadClass(
      'dev.latvian.mods.kubejs.recipe.schema.minecraft.ShapedRecipeSchema'
    )
    e.register(
      'pneumaticcraft:compressor_upgrade_crafting',
      $ShapedRecipeSchema.SCHEMA
    )
    e.register(
      'pneumaticcraft:crafting_shaped_no_mirror',
      $ShapedRecipeSchema.SCHEMA
    )
    e.register(
      'pneumaticcraft:crafting_shaped_pressurizable',
      $ShapedRecipeSchema.SCHEMA
    )
    console.log('Recipe Schemas for pneumaticcraft loaded.')
  }
})
