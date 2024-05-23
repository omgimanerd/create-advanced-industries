// priority: 1000

/**
 * Generates a list of 3-length arrays containing all the relative coordinates
 * within the given relative coordinate offset object.
 *
 * @param {Internal.AABB} aabb
 * @returns {Vec3i[]}
 */
global.getOffsetList = (aabb) => {
  const offsetList = []
  for (const x = aabb.minX; x <= aabb.maxX; x++) {
    for (const y = aabb.minY; y <= aabb.maxY; y++) {
      for (const z = aabb.minZ; z <= aabb.maxZ; z++) {
        offsetList.push(new Vec3i(x, y, z))
      }
    }
  }
  return offsetList
}

/**
 * @param {Internal.BlockContainerJS} block
 * @param {Internal.Direction|string} direction
 */
global.getSameDirectionBlock = (block, direction) => {
  switch (direction) {
    case 'north':
      return block.north
    case 'south':
      return block.south
    case 'east':
      return block.east
    case 'west':
      return block.west
    case 'up':
      return block.up
    case 'down':
      return block.down
    default:
      throw new Error(`Unknown direction ${direction}`)
  }
}

/**
 * @param {Internal.BlockContainerJS} block
 * @param {Internal.Direction|string} direction
 */
global.getOppositeDirectionBlock = (block, direction) => {
  switch (direction) {
    case 'north':
      return block.south
    case 'south':
      return block.north
    case 'east':
      return block.west
    case 'west':
      return block.east
    case 'up':
      return block.down
    case 'down':
      return block.up
    default:
      throw new Error(`Unknown direction ${direction}`)
  }
}

/**
 * @param {Internal.BlockContainerJS} block
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
