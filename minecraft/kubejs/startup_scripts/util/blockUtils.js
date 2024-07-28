// priority: 1000

/**
 * Returns the x, y, z values of the given argument as a dictionary for
 * easy unpacking.
 * @param {BlockPos_|Vec3d_|Vec3f_|Vec3i_} v
 */
global.getXYZ = (v) => {
  return {
    x: typeof v.x === 'function' ? v.x() : v.x,
    y: typeof v.y === 'function' ? v.y() : v.y,
    z: typeof v.z === 'function' ? v.z() : v.z,
  }
}

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
