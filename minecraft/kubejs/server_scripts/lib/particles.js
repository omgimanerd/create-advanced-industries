// priority: 1000

/**
 * Helper for calling Level.spawnParticles
 * @param {Internal.Level} level
 * @param {Internal.ParticleOptions_} particle
 * @param {number[]|{x: number, y: number, z: number}} pos
 * @param {number[]|{vx: number, vy: number, vz: number}} v
 * @param {number} count
 * @param {number} speed
 * @param {?boolean} overrideLimiter
 */
const spawnParticles = (
  level,
  particle,
  pos,
  v,
  count,
  speed,
  overrideLimiter
) => {
  overrideLimiter = overrideLimiter === undefined ? true : overrideLimiter
  let x, y, z
  if (Array.isArray(pos) && pos.length === 3) {
    ;[x, y, z] = pos
  } else if (
    pos.x === undefined ||
    pos.y === undefined ||
    pos.z === undefined
  ) {
    ;({ x, y, z } = pos)
  } else {
    throw new Error(`Unknown pos argument ${pos}`)
  }
  let vx, vy, vz
  if (Array.isArray(v) && v.length === 3) {
    ;[vx, vy, vz] = v
  } else if (v.vx === undefined || v.vy === undefined || v.vz === undefined) {
    ;({ vx, vy, vz } = v)
  } else {
    throw new Error(`Unknown v argument ${v}`)
  }
  level.spawnParticles(
    particle,
    overrideLimiter,
    x,
    y,
    z,
    vx,
    vy,
    vz,
    count,
    speed
  )
}

/**
 * @param {Internal.Level} level
 * @param {BlockPos} pos
 * @param {number} count
 * @param {number} spread
 * @param {number[]} color Color as array of RGBE values in [0, 1)
 */
const spawnEffectParticles = (level, pos, count, spread, color) => {
  count = count === undefined ? 1 : count
  spread = spread === undefined ? 0.25 : spread
  color = color === undefined ? [0, 0, 0, 1] : color
  let x, y, z
  if (Array.isArray(pos) && pos.length == 3) {
    ;[x, y, z] = pos
  } else if (
    pos.x === undefined ||
    pos.y === undefined ||
    pos.z === undefined
  ) {
    ;({ x, y, z } = pos)
  } else {
    throw new Error(`Unknown pos argument ${pos}`)
  }
  let r, g, b, e
  if (Array.isArray(color) && color.length === 4) {
    ;[r, g, b, e] = color
  } else if (
    color.r === undefined ||
    color.g === undefined ||
    color.b === undefined ||
    color.e === undefined
  ) {
    ;({ r, g, b, e } = color)
  } else {
    throw new Error(`Unknown color argument ${color}`)
  }
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
