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
const getPaintingRegistryAndWorldSeed = () => {
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

/**
 * Gets the world seed and generates a listing of the paintings that are
 * considered artifact, legendary, epic, and rare using this world seed.
 *
 * @returns {{ ResourceLocation_ : string }}
 */
global.getTieredPaintingVariants = () => {
  const [variants, seed] = getPaintingRegistryAndWorldSeed()
  const random = global.wrapSeededRandom(Utils.newRandom(seed))
  // This shuffled list is unique per world seed.
  global.shuffle(variants, random)

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
  return tieredVariants
}

/**
 * Generates the probability weight distribution that a rare painting is
 * produced from Pembi the Artist using the world seed's RNG.
 *
 * This can be used by the Vose Alias sampler to generate the painting variants
 * in their corresponding yield probability.
 */
global.getPaintingWeightDistribution = () => {
  const [variants, _] = getPaintingRegistryAndWorldSeed()
  const tieredVariants = global.getTieredPaintingVariants()
  const weights = {}
  const tierWeight = {
    artifact: 1, // 1 total artifact painting
    legendary: 3, // 2 total legendary paintings for a total weight of 6
    epic: 10, // 3 total epic paintings for a total weight of 30
    rare: 15, // 5 total rare paintings for a total weight of 75
    other: 20, // All other paintings take up the rest of the probability space
  }
  variants.forEach((variant) => {
    if (variant in tieredVariants) {
      weights[variant] = tierWeight[tieredVariants[variant]]
    } else {
      weights[variant] = tierWeight.other
    }
  })
  return weights
}
