// priority: 1000

/**
 * @param {$MinecraftServer_} server
 * @param {number} duration Duration to repeat the callback in ticks
 * @param {number} interval Repeat interval in ticks
 * @param {function} cb
 */
const repeat = (server, duration, interval, cb) => {
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
