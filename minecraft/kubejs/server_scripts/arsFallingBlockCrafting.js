// priority: 1000

/**
 *
 * @param {Internal.EntityLeaveLevelEvent_} e
 */
global.EntityLeaveLevelEventCallback = (e) => {
  if (e.entity.type !== 'ars_nouveau:enchanted_falling_block') return

  console.log(e.entity.block, e.entity.nbt, e.entity.deltaMovement)
}
