// priority: 1000

/**
 * @typedef {Vec3f_|number[]|{x: number, y: number, z:number}} Vec3Like
 */

/**
 * @param {Vec3Like} v
 * @returns {number[]}
 */
const parseVec3Like = (v) => {
  if (
    typeof v.x === 'function' &&
    typeof v.y === 'function' &&
    typeof v.z === 'function'
  ) {
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
 * https://minecraft.fandom.com/wiki/Commands/particle
 * @param {Internal.Level_} level
 * @param {Internal.ParticleOptions_} particle
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
 * @param {Internal.Level_} level
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

/**
 * @param {Internal.Level_} level
 * @param {BlockPos_} pos
 */
const debugBlockPos = (level, pos) => {
  ;((x, y, z) => {
    repeat(
      /*server*/ level.server,
      /*duration*/ 60,
      /*interval*/ 10,
      /*cb*/ () => {
        spawnParticles(
          level,
          'minecraft:composter',
          [x + 0.5, y + 0.5, z + 0.5],
          0.05,
          5,
          0.05,
          true
        )
      }
    )
  })(pos.x, pos.y, pos.z)
}

/**
 * Visualizes an AABB in world with particle effects to help debug.
 * @param {Internal.Level_} level
 * @param {AABB_} aabb
 */
const debugAABB = (level, aabb) => {
  const [x1, y1, z1] = [aabb.minX, aabb.minY, aabb.minZ]
  const [x2, y2, z2] = [aabb.maxX, aabb.maxY, aabb.maxZ]
  const edges = [
    // Bottom edges
    [new Vec3f(x1, y1, z1), new Vec3f(x2, y1, z1)],
    [new Vec3f(x1, y1, z1), new Vec3f(x1, y1, z2)],
    [new Vec3f(x1, y1, z2), new Vec3f(x2, y1, z2)],
    [new Vec3f(x2, y1, z1), new Vec3f(x2, y1, z2)],
    // Top edges
    [new Vec3f(x1, y2, z1), new Vec3f(x2, y2, z1)],
    [new Vec3f(x1, y2, z1), new Vec3f(x1, y2, z2)],
    [new Vec3f(x1, y2, z2), new Vec3f(x2, y2, z2)],
    [new Vec3f(x2, y2, z1), new Vec3f(x2, y2, z2)],
    // Vertical edges
    [new Vec3f(x1, y1, z1), new Vec3f(x1, y2, z1)],
    [new Vec3f(x2, y1, z2), new Vec3f(x2, y2, z2)],
    [new Vec3f(x1, y1, z2), new Vec3f(x1, y2, z2)],
    [new Vec3f(x2, y1, z1), new Vec3f(x2, y2, z1)],
  ]
  repeat(
    /*server*/ level.server,
    /*duration*/ 60,
    /*interval*/ 10,
    /*cb*/ () => {
      for (let [from, to] of edges) {
        for (let i = 0; i < 1; i += 0.1) {
          spawnParticles(
            level,
            'minecraft:composter',
            from.clone().lerp(to, i),
            0.01,
            5,
            0.01,
            true
          )
        }
      }
    }
  )
}
