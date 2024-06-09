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
  const inputItemArray = Components.get('inputItemArray')()
  const inputFluidOrItemArray = Components.get('inputFluidOrItemArray')()
  const itemTag = Components.get('tag')({ registry: 'item' })
  const outputItem = Components.get('outputItem')()
  const outputItemArray = Components.get('outputItemArray')()
  const outputFluidOrItemArray = Components.get('outputFluidOrItemArray')()
  const inputFluid = Components.get('inputFluid')()
  const fluidTag = Components.get('tag')({ registry: 'fluid' })
  const fluidOrTagInput = inputFluid.or(
    new $RecipeComponentBuilder(2)
      .add(fluidTag.key('fluidTag'))
      .add(intNumber.key('amount'))
      .inputRole()
  )
  const outputFluid = Components.get('outputFluid')()
  const outputFluidArray = Components.get('outputFluidArray')()
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
        intNumber.key('maxChargeRate').optional(Number.MAX_VALUE)
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
        inputFluidOrItemArray.key('ingredients'),
        inputItem.key('catalyst').allowEmpty().defaultOptional()
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
        outputFluidOrItemArray.key('results'),
        inputFluidOrItemArray.key('ingredients'),
        intNumber.key('secondaryFluidResults').optional(0),
        intNumber.key('secondaryFluidInputs').optional(0),
        intNumber.key('processingTime').alwaysWrite().optional(40),
        heatCondition.key('heatRequirement').allowEmpty().defaultOptional()
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

  // PneumaticCraft: Repressurized
  // if (Platform.isLoaded('pneumaticcraft')) {
  //   let $ArrayRecipeComponent = Java.loadClass(
  //     'dev.latvian.mods.kubejs.recipe.component.ArrayRecipeComponent'
  //   )
  //   let $ShapedRecipeSchema = Java.loadClass(
  //     'dev.latvian.mods.kubejs.recipe.schema.minecraft.ShapedRecipeSchema'
  //   )

  //   let pncrAmadronIO = new $RecipeComponentBuilder(3)
  //     .add(
  //       new $StringComponent('must be ITEM or FLUID', (s) => {
  //         return s === 'ITEM' || s === 'FLUID'
  //       }).key('type')
  //     )
  //     .add(intNumber.key('amount'))
  //     .add(id.key('id'))
  //     .inputRole()
  //   let pncrFluidIdInput = new $RecipeComponentBuilder(3)
  //     .add(anyString.key('type').optional('pneumaticcraft:fluid').alwaysWrite())
  //     .add(intNumber.key('amount'))
  //     .add(id.key('fluid'))
  //     .inputRole()
  //   let pncrFluidTagInput = new $RecipeComponentBuilder(3)
  //     .add(anyString.key('type').optional('pneumaticcraft:fluid').alwaysWrite())
  //     .add(intNumber.key('amount'))
  //     .add(fluidTag.key('tag'))
  //     .inputRole()
  //   let pncrFluidInput = pncrFluidIdInput.or(pncrFluidTagInput)

  //   let pncrItemIdInput = new $RecipeComponentBuilder(3)
  //     .add(
  //       anyString
  //         .key('type')
  //         .optional('pneumaticcraft:stacked_item')
  //         .alwaysWrite()
  //     )
  //     .add(intNumber.key('amount'))
  //     .add(id.key('item'))
  //     .inputRole()
  //   let pncrItemTagInput = new $RecipeComponentBuilder(3)
  //     .add(
  //       anyString
  //         .key('type')
  //         .optional('pneumaticcraft:stacked_item')
  //         .alwaysWrite()
  //     )
  //     .add(intNumber.key('amount'))
  //     .add(itemTag.key('tag'))
  //     .inputRole()
  //   let pncrItemInput = pncrItemIdInput.or(pncrItemTagInput)
  //   let pncrItemArrayInput = new $ArrayRecipeComponent(
  //     pncrItemTagInput,
  //     true,
  //     pncrItemIdInput.class,
  //     []
  //   )

  //   let pncrBonusOutput = new $RecipeComponentBuilder(2)
  //     .add(floatNumber.key('limit'))
  //     .add(floatNumber.key('multiplier'))
  //     .inputRole()
  //     .key('bonus_output')
  //   let pncrTempRange = new $RecipeComponentBuilder(2)
  //     .add(intNumber.key('min_temp').allowEmpty().defaultOptional())
  //     .add(intNumber.key('max_temp').allowEmpty().defaultOptional())
  //     .inputRole()
  //     .key('temperature')

  //   e.register(
  //     'pneumaticcraft:amadron',
  //     new $RecipeSchema(
  //       pncrAmadronIO.key('input'),
  //       pncrAmadronIO.key('output'),
  //       intNumber.key('level').optional(0),
  //       bool.key('static').alwaysWrite().optional(false)
  //     )
  //   )
  //   e.register(
  //     'pneumaticcraft:assembly_drill',
  //     new $RecipeSchema(
  //       inputItem.key('input'),
  //       outputItem.key('result'),
  //       anyString.key('program').optional('drill').alwaysWrite()
  //     )
  //   )
  //   e.register(
  //     'pneumaticcraft:assembly_laser',
  //     new $RecipeSchema(
  //       inputItem.key('input'),
  //       outputItem.key('result'),
  //       anyString.key('program').optional('laser').alwaysWrite()
  //     )
  //   )
  //   e.register(
  //     'pneumaticcraft:explosion_crafting',
  //     new $RecipeSchema(
  //       inputItem.key('input'),
  //       outputItemArray.key('results'),
  //       intNumber.key('loss_rate').optional(20).alwaysWrite()
  //     )
  //   )
  //   e.register(
  //     'pneumaticcraft:fluid_mixer',
  //     new $RecipeSchema(
  //       pncrFluidInput.key('input1'),
  //       pncrFluidInput.key('input2'),
  //       floatNumber.key('pressure'),
  //       intNumber.key('time'),
  //       outputItem.key('item_output').allowEmpty().defaultOptional(),
  //       outputFluid.key('fluid_output').allowEmpty().defaultOptional()
  //     )
  //   )
  //   e.register(
  //     'pneumaticcraft:heat_frame_cooling',
  //     new $RecipeSchema(
  //       pncrFluidInput.key('input'),
  //       outputItem.key('result'),
  //       intNumber.key('max_temp'),
  //       pncrBonusOutput.allowEmpty().defaultOptional()
  //     )
  //   )
  //   e.register(
  //     'pneumaticcraft:fuel_quality',
  //     new $RecipeSchema(
  //       pncrFluidInput.key('fluid'),
  //       intNumber.key('air_per_bucket'),
  //       floatNumber.key('burn_rate')
  //     )
  //   )
  //   e.register(
  //     'pneumaticcraft:pressure_chamber',
  //     new $RecipeSchema(
  //       pncrItemArrayInput.key('inputs'),
  //       outputItemArray.key('results'),
  //       floatNumber.key('pressure')
  //     )
  //   )
  // e.register(
  //   'pneumaticcraft:refinery',
  //   new $RecipeSchema(
  //     pncrFluidInput.key('input'),
  //     outputFluidArray.key('results'),
  //     pncrTempRange
  //   )
  // )
  // e.register(
  //   'pneumaticcraft:thermo_plant',
  //   new $RecipeSchema(
  //     pncrFluidInput.key('fluid_input').defaultOptional(),
  //     inputItem.key('item_input').defaultOptional(),
  //     outputFluid.key('fluid_output').defaultOptional(),
  //     outputItem.key('item_output').defaultOptional(),
  //     pncrTempRange.allowEmpty().defaultOptional(),
  //     bool.key('exothermic').optional(false).alwaysWrite(),
  //     floatNumber.key('speed').allowEmpty().defaultOptional()
  //   )
  // )
  // e.register(
  //   'pneumaticcraft:compressor_upgrade_crafting',
  //   $ShapedRecipeSchema.SCHEMA
  // )
  // e.register(
  //   'pneumaticcraft:crafting_shaped_no_mirror',
  //   $ShapedRecipeSchema.SCHEMA
  // )
  // e.register(
  //   'pneumaticcraft:crafting_shaped_pressurizable',
  //   $ShapedRecipeSchema.SCHEMA
  // )
  //   console.log('Recipe Schemas for pneumaticcraft loaded.')
  // }
})
