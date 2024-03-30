// priority: 0


console.info('Hello, World! (Loaded server scripts)')

ServerEvents.recipes(event => {
  event.shapeless('minecraft:gravel', ['3x minecraft:flint'])
})