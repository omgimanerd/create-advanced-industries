// priority: 1000

/**
 * Generates a list of Vec3i objects containing all the integral block
 * coordinates with the given AABB, max exclusive.
 * @param {AABB_} aabb
 * @returns {BlockPos[]}
 */
global.getBlockList = (aabb) => {
  const blockList = []
  for (let x = aabb.minX; x < aabb.maxX; x++) {
    for (let y = aabb.minY; y < aabb.maxY; y++) {
      for (let z = aabb.minZ; z < aabb.maxZ; z++) {
        blockList.push(new BlockPos(x, y, z))
      }
    }
  }
  return blockList
}

/**
 * Returns the total internal volume of the given AABB.
 * @param {AABB_} aabb
 */
global.getVolume = (aabb) => {
  return aabb.getXsize() * aabb.getYsize() * aabb.getZsize()
}

/**
 * @param {Internal.BlockContainerJS_} block
 */
global.getSurroundingBlocks = (block) => {
  return [
    block.up,
    block.down,
    block.north,
    block.south,
    block.east,
    block.west,
  ]
}
