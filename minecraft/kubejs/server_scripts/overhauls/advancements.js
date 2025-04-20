// priority: 1000
// Remove all advancements.

AdvJSEvents.advancement((e) => {
  for (const mod of Platform.getList()) {
    e.remove({
      mod: mod,
    })
  }
})
