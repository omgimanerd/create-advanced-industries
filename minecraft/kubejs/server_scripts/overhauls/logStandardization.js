// priority: 1000

const STRIPPED_LOG_REGEX = /^[a-z_]*:stripped_[a-z_]*_(log|hyphae|stem|block)$/

ServerEvents.tags('item', (e) => {
  // As far as I can tell, this regex should match all stripped logs. Check if
  // they are correctly tagged, otherwise tag them.
  //
  // These tags can be used in recipes, which will be evaluated at the time of
  // the craft, but they cannot be used in Ingredient.of('#tag'), since the
  // association will not be available.
  //
  // ServerEvents.tags does not deterministically run before
  // ServerEvents.recipes either.
  Ingredient.of(STRIPPED_LOG_REGEX).itemIds.forEach((id) => {
    if (!Item.of(id).hasTag('forge:stripped_logs')) {
      e.add('forge:stripped_logs', id)
      console.log(`${id} was not tagged with forge:stripped_logs, adding tag.`)
    }
  })
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  const getLogIdFromStripped = (s) => {
    return s.replace('stripped_', '')
  }
  // Store a mapping of all logs and stripped logs.
  const logs = {}
  const strippedLogs = {}
  const mapping = {}
  Ingredient.of(STRIPPED_LOG_REGEX).itemIds.forEach((id) => {
    logs[getLogIdFromStripped(id)] = true
    strippedLogs[id] = true
    mapping[getLogIdFromStripped(id)] = id
  })

  // Validate the log to stripped log mapping, and that all unstripped logs are
  // present in #minecraft:logs. This will work as long as #minecraft:logs has
  // not been modified by KJS, again for tag/recipe load determinism reasons.
  Ingredient.of('#minecraft:logs').itemIds.forEach((id) => {
    if (id.endsWith('wood')) return
    if (id in logs) return
    if (id in strippedLogs) return
    console.error(`${id} is in #minecraft:logs but does not have a mapping`)
  })

  // Remove and register cutting and stripping recipes for all of them.
  Ingredient.of(STRIPPED_LOG_REGEX).itemIds.forEach((id) => {
    const log = getLogIdFromStripped(id)
    create
      .item_application(id, [log, '#forge:tools/axes'])
      .id(
        `kubejs:${stripOutputPrefix(log)}_to_${stripOutputPrefix(id)}_stripping`
      )

    // Remove and add a cutting recipe
    e.remove({ type: 'create:cutting', output: id })
    create.cutting(id, log)

    // Remove and add a Farmer's Delight cutting recipe for bark
    e.remove({ type: 'farmersdelight:cutting', output: id })
    e.recipes.farmersdelight.cutting(
      log,
      [id, 'farmersdelight:tree_bark'],
      '#forge:tools/axes'
    )

    // Add a sanding recipe that yields sawdust
    create
      .polishing([id, Item.of('thermal:sawdust', 3)], log)
      .speed_limits(POLISHING_MEDIUM_SPEED)
  })

  // Add a lathing recipe for hollow logs
  e.forEachRecipe(
    {
      type: 'minecraft:crafting_shaped',
      id: /^quark:building\/crafting\/hollowlogs.*/,
    },
    (r) => {
      const recipe = JSON.parse(r.json)
      const log = recipe?.key?.L?.item
      const hollowLog = recipe?.result?.item
      if (log === null || hollowLog === null) {
        console.error(`Unknown log recipe ${recipe}`)
      }
      create.turning([hollowLog, '3x thermal:sawdust'], log, 80)
    }
  )
})
