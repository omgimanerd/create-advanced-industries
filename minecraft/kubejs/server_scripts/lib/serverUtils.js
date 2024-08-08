// priority: 1000

/**
 * @param {Internal.MinecraftServer_} server
 * @param {number} duration Duration to repeat the callback in ticks
 * @param {number} interval Repeat interval in ticks
 * @param {function} cb
 */
const repeat = (server, duration, interval, cb, done) => {
  const startTime = server.getTickCount()
  const endTime = startTime + duration
  server.scheduleRepeatingInTicks(0, (c) => {
    const currentTime = server.getTickCount()
    cb(c)
    if (currentTime >= endTime) {
      if (done !== undefined && typeof done === 'function') done()
      c.clear()
    } else {
      c.reschedule(interval)
    }
  })
}
