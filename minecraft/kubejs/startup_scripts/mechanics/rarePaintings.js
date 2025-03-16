// priority: 0
// Library code to select rare paintings deterministically from the world seed.
// Declared here for use on the client and and server side. These functions
// cannot be called here without a world seed or registry available.

/**
 * Helper to validate and return the list of registered paintings and the world
 * seed.
 *
 * @returns {[ResourceLocation[], number]}
 */
global.getPaintingRegistryAndWorldSeed = () => {
  const variants = Utils.getRegistryIds('painting_variant')
  if (!variants || variants.length === 0) {
    throw new Error(
      'getSelectedPaintings() was called somewhere without registry ' +
        'availability!'
    )
  }
  if (variants.length < 9) {
    throw new Error('Not enough paintings in registry?')
  }
  if (!global.WORLD_SEED || global.WORLD_SEED === -1) {
    throw new Error(
      'getSelectedPaintings() was called somewhere without the ' +
        'world seed available!'
    )
  }
  return [variants, global.WORLD_SEED]
}

// Cache for the tiered painting variants, lazily loaded the first time
// getTieredPaintingVariants is called. Because of weird KubeJS things, this
// cannot be set to the actual null or it will make every script that tries to
// access it explode.
global.TIERED_PAINTING_VARIANTS = 'null'

/**
 * Gets the world seed and generates a listing of the paintings that are
 * considered artifact, legendary, epic, and rare using this world seed.
 *
 * @returns {{ ResourceLocation_ : string }}
 */
global.getTieredPaintingVariants = () => {
  if (global.TIERED_PAINTING_VARIANTS !== 'null') {
    return global.TIERED_PAINTING_VARIANTS
  }
  const [variants, seed] = global.getPaintingRegistryAndWorldSeed()
  const random = wrapSeededRandom(Utils.newRandom(seed))
  // This shuffled list is unique per world seed.
  shuffle(variants, random)

  // Select some number of painting variants for each tier of rarity.
  const tieredVariants = {}
  let i = 0
  for (const [tier, counts] of Object.entries({
    artifact: 1,
    legendary: 2,
    epic: 3,
    rare: 5,
  })) {
    for (let j = 0; j < counts; ++j) {
      tieredVariants[variants[i++]] = tier
    }
  }
  global.TIERED_PAINTING_VARIANTS = tieredVariants
  return tieredVariants
}
