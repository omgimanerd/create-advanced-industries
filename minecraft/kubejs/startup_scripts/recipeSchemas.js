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

  const anyString = Components.get('anyString')()
  const blockTag = Components.get('blockTag')()
  const bool = Components.get('bool')()
  const id = Components.get('id')()
  const intNumber = Components.get('intNumber')()
  const filteredString = Components.get('filteredString')
  const floatNumber = Components.get('floatNumber')()

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

  let $HeatCondition, heatCondition
  if (Platform.isLoaded('create')) {
    $HeatCondition = Java.loadClass(
      'com.simibubi.create.content.processing.recipe.HeatCondition'
    )
    heatCondition = Components.get('enum')({ class: $HeatCondition })
  }

  // Apotheosis
  if (Platform.isLoaded('apotheosis')) {
    let enchantingRequirements = new $RecipeComponentBuilder(3)
      .add(intNumber.key('eterna').optional(-1))
      .add(intNumber.key('quanta').optional(-1))
      .add(intNumber.key('arcana').optional(-1))
    e.register(
      'apotheosis:enchanting',
      new $RecipeSchema(
        inputItem.key('input'),
        outputItem.key('result'),
        enchantingRequirements.key('requirements').defaultOptional(),
        enchantingRequirements.key('max_requirements').defaultOptional(),
        intNumber.key('display_level').optional(0)
      )
    )
    console.log('Recipe Schemas for apotheosis loaded.')
  }

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
      'vintageimprovements:hammering',
      new $RecipeSchema(
        outputItem.asArray().key('results'),
        inputItem.asArray().key('ingredients'),
        intNumber.key('hammerBlows').optional(3)
      )
    )
    e.register(
      'vintageimprovements:laser_cutting',
      new $RecipeSchema(
        outputItem.asArray().key('results'),
        inputItem.asArray().key('ingredients'),
        intNumber.key('energy').alwaysWrite().optional(2000),
        intNumber.key('maxChargeRate').alwaysWrite().optional(50)
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
      'vintageimprovements:pressurizing',
      new $RecipeSchema(
        outputFluidOrItem.asArray().key('results'),
        inputFluidOrItem.asArray().key('ingredients'),
        intNumber.key('secondaryFluidOutput').optional(0),
        intNumber.key('secondaryFluidInput').optional(0),
        intNumber.key('processingTime').alwaysWrite().optional(40),
        heatCondition.key('heatRequirement').optional('none')
      )
    )
    e.register(
      'vintageimprovements:turning',
      new $RecipeSchema(
        outputItem.asArray().key('results'),
        inputItem.asArray().key('ingredients'),
        intNumber.key('processingTime').optional(200)
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

  // Farmer's Delight
  if (Platform.isLoaded('farmersdelight')) {
    e.register(
      'farmersdelight:cooking',
      new $RecipeSchema(
        inputItem.asArray().key('ingredients'),
        outputItem.key('result'),
        intNumber.key('cookingtime'),
        floatNumber.key('experience').optional(1),
        inputItem.key('container').defaultOptional(),
        anyString.key('recipe_book_tab').optional('meals')
      )
    )
    let itemOrAction = inputItem.or(
      new $RecipeComponentBuilder(2)
        .add(
          anyString
            .key('type')
            .alwaysWrite()
            .optional('farmersdelight:tool_action')
        )
        .add(anyString.key('action'))
    )
    e.register(
      'farmersdelight:cutting',
      new $RecipeSchema(
        inputItem.asArray().key('ingredients'),
        outputItem.asArray().key('result'),
        itemOrAction.key('tool'),
        anyString.key('sound').defaultOptional()
      )
    )
  }

  // PneumaticCraft: Repressurized
  if (Platform.isLoaded('pneumaticcraft')) {
    let $MapRecipeComponent = Java.loadClass(
      'dev.latvian.mods.kubejs.recipe.component.MapRecipeComponent'
    )

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

    let pncrFluidInput = inputFluid
      .or(
        new $RecipeComponentBuilder(2)
          .add(fluidTag.key('tag'))
          .add(intNumber.key('amount'))
          .inputRole()
      )
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
      .key('bonus_output')
    let pncrTempRange = new $RecipeComponentBuilder(2)
      .add(intNumber.key('min_temp').optional(0))
      .add(intNumber.key('max_temp').optional(0))
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
        pncrFluidInput.or(pncrItemInput).key('input'),
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
      ).addConstructor(() => {})
    )
    let transformBlock = new $RecipeComponentBuilder(2)
      .add(
        Components.get('outputBlockStateString')()
          .key('block')
          .defaultOptional()
      )
      .add(fluidTag.key('fluid').defaultOptional())
    e.register(
      'pneumaticcraft:heat_properties',
      new $RecipeSchema(
        fluidTag.key('fluid').defaultOptional(),
        blockTag.key('block').defaultOptional(),
        new $MapRecipeComponent(anyString, anyString, true)
          .key('statePredicate')
          .defaultOptional(),
        intNumber.key('temperature').optional(0),
        intNumber.key('thermalResistance').optional(0),
        intNumber.key('heatCapacity').optional(0),
        transformBlock.key('transformCold').defaultOptional(),
        transformBlock.key('transformHot').defaultOptional(),
        anyString.key('description').optional('')
      ).addConstructor(() => {})
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
