// priority: 1000

const $Vec3 = Java.loadClass('net.minecraft.world.phys.Vec3')

/**
 * @typedef {$Vec3|number[]|{x: number, y: number, z:number}} Vec3Like
 */

/**
 * @param {Vec3Like} v
 * @returns {number[]}
 */
const parseVec3Like = (v) => {
  if (v.class === $Vec3) {
    return [v.x(), v.y(), v.z()]
  } else if (Array.isArray(v) && v.length === 3) {
    return v
  } else if (v.x !== undefined && v.y !== undefined && v.z !== undefined) {
    return [v.x, v.y, v.z]
  }
  throw new Error(`Unknown Vec3 argument ${v}`)
}

/**
 * Helper for calling Level.spawnParticles
 * @param {Internal.Level} level
 * @param {Internal.ParticleOptions_} particl0
 * @param {Vec3Like} pos
 * @param {number|Vec3Like} v
 * @param {number} count
 * @param {number} speed
 * @param {?boolean} [overrideLimiter=true]
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
  const [x, y, z] = parseVec3Like(pos)
  let vx, vy, vz
  if (typeof v === 'number') {
    vx = vy = vz = v
  } else {
    ;[vx, vy, vz] = parseVec3Like(v)
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
 * @param {Vec3Like} pos
 * @param {number} count
 * @param {number} spread
 * @param {number[]} color Color as array of RGBE values in [0, 1)
 */
const spawnEffectParticles = (level, pos, count, spread, color) => {
  count = count === undefined ? 1 : count
  spread = spread === undefined ? 0.25 : spread
  color = color === undefined ? [0, 0, 0, 1] : color
  const [x, y, z] = parseVec3Like(pos)
  let r, g, b, e
  if (Array.isArray(color) && color.length === 4) {
    ;[r, g, b, e] = color
  } else if (
    color.r !== undefined &&
    color.g !== undefined &&
    color.b !== undefined &&
    color.e !== undefined
  ) {
    r = color.r
    g = color.g
    b = color.b
    e = color.e
  } else {
    throw new Error(`Unknown color argument ${color}`)
  }
  for (let i = 0; i < count; ++i) {
    level.spawnParticles(
      'minecraft:entity_effect',
      true, // overrideLimiter
      x + global.randRange(-spread, spread), // x position
      y, // y position
      z + global.randRange(-spread, spread), //  z position
      r, // vx, used as r channel, values in [0, 1)
      g, // vy, used as g channel, values in [0, 1)
      b, // vz, used as b channel, values in [0, 1)
      0, // count, must be 0 for 'minecraft:entity_effect'
      e // speed, used as intensity, multiplied into r, g, b
    )
  }
}
