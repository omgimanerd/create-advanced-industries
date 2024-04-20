// priority: 1000

/**
 * @param {Internal.MinecraftServer} server
 * @param {number} duration Duration to repeat the callback in ticks
 * @param {number} interval Repeat interval in ticks
 * @param {function} cb
 */
const repeat = (
  /** @type {Internal.MinecraftServer} */ server,
  /** @type {number} */ duration,
  /** @type {number} */ interval,
  /** @type {function} */ cb
) => {
  const startTime = server.getTickCount()
  const endTime = startTime + duration
  server.scheduleRepeatingInTicks(0, (c) => {
    const currentTime = server.getTickCount()
    cb()
    if (currentTime >= endTime) {
      c.clear()
    } else {
      c.reschedule(interval)
    }
  })
}
