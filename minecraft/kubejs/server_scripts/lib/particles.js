// priority: 1000

/**
 * @param {Internal.Level}
 * @param {BlockPos}
 */
const spawnEffectParticles = (
  /** @type {Internal.Level} */ level,
  /** @type {BlockPos} */ location,
  /** @type {number} */ count,
  /** @type {number} */ spread,
  /** @type {number[]} */ color
) => {
  count = count === undefined ? 1 : count
  spread = spread === undefined ? 0.25 : spread
  color = color === undefined ? [0, 0, 0, 1] : color
  if (color.length !== 4) throw new Error(`Invalid color array: ${color}`)
  const [r, g, b, e] = color
  if (!location.x || !location.y || !location.z) {
    throw new Error(`Invalid location ${location}`)
  }
  const { x, y, z } = location
  for (let i = 0; i < count; ++i) {
    level.spawnParticles(
      'minecraft:entity_effect',
      true, // overrideLimiter
      x + randRange(-spread, spread), // x position
      y, // y position
      z + randRange(-spread, spread), //  z position
      r, // vx, used as r channel, values in [0, 1)
      g, // vy, used as g channel, values in [0, 1)
      b, // vz, used as b channel, values in [0, 1)
      0, // count, must be 0 for 'minecraft:entity_effect'
      e // speed, used as intensity, multiplied into r, g, b
    )
  }
}
